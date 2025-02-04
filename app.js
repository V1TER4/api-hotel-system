import SqsConsumerService from './sqs/sqsConsumer.js';
import * as routes from './routes/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';
import cors from 'cors';

env.config();

const app = express();
const PORT = process.env.PORT;

const consumerService = new SqsConsumerService();  // Instancia o serviço
consumerService.startConsumer();  // Inicia o consumidor

app.use(cors());
app.use(bodyParser.json());

app.get('/index', (req, res) => {
    res.send("AQUI: " + process.env.DB_NAME)
})

// Authorization
app.use('/auth', routes.auth);

// User
app.use('/api/user', routes.user);

// Hotel
app.use('/api/hotel', routes.hotel);

// Room
app.use('/api/room', routes.room);

// Booking
app.use('/api/booking', routes.booking);

app.listen(PORT)