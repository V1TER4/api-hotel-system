import { SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export default class SqsConsumerService {
    constructor() {
        this.sqsClient = new SQSClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        this.queueUrl = process.env.SQS_QUEUE_URL || '';
        if (!this.queueUrl) {
            throw new Error('Missing SQS_QUEUE_URL environment variable');
        }
        this.consumerInterval = null;
    }

    startConsumer() {
        const app = Consumer.create({
            queueUrl: this.queueUrl,
            handleMessage: async (message) => {
                const attributes = message.MessageAttributes || {};
                const queueType = attributes.QueueType?.StringValue || "Unknown";

                if (queueType !== "Confirmation") {
                    console.log("Mensagem ignorada.");
                    return;
                }

                const transactionType = attributes.TransactionUrl?.StringValue || "Unknown";
                if (!transactionType) {
                    console.error("TransactionUrl não encontrado.");
                    return;
                }

                const payload = JSON.parse(message.Body);
                await this.sendMessageToEndpoint(transactionType, payload);
            },
            sqs: this.sqsClient,
            messageAttributeNames: ["All"],
            shouldDeleteMessages: false,
        });

        app.on("error", (err) => {
            console.error("Erro no consumidor SQS:", err.message);
        });

        app.on("processing_error", (err) => {
            console.error("Erro ao processar mensagem:", err.message);
        });

        const interval = parseInt(process.env.CONSUMER_INTERVAL || '5000', 10); // 5 seg
        this.consumerInterval = setInterval(() => {
            app.start();
            console.log("Consumidor SQS iniciado.");
        }, interval);
    }

    async sendMessageToEndpoint(endpoint, payload) {
        try {
            console.log(endpoint)
            console.log(payload)
            const response = await axios.post(`${process.env.APP_URL}/${endpoint}`, payload);
            console.log("Mensagem enviada para o endpoint:", response.data);
        } catch (error) {
            console.error("Erro ao enviar mensagem para o endpoint:", error.message);
        }
    }

    stopConsumer() {
        if (this.consumerInterval) {
            clearInterval(this.consumerInterval);
            console.log("Consumidor SQS parado.");
        }
    }
}

// Inicializa e executa o consumer
const consumerService = new SqsConsumerService();
consumerService.startConsumer();
