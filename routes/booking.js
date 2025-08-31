import express from 'express';
import db from '../models/index.js';
import constants from '../constants/index.js';
import logger from '../logs/logger.js';
import services from '../services/index.js';
import {SqsService} from '../sqs/sqsService.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';
import { buildTransactionMessage } from '../utils/financialTransaction.js';

const route = express.Router();

// List all bookings by user
route.get('/:id', validateToken, async (req, res) => {
    try {
        const Booking = db.bookings;
        const bookings = await Booking.findAll({
            where: { hotel_id: req.params.id },
            include: [
                { model: db.booking_status, as: 'status' },
                { model: db.users, as: 'user' },
                { model: db.hotel_rooms, as: 'hotel_room' },
            ]
        });

        return res.status(200).json({ message: 'Success', data: bookings });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Create a booking
route.post('/', validateToken, async (req, res) => {
    const Booking = db.bookings;
    const requiredFields = ['user_id', 'room_id', 'check_in', 'check_out', 'total_guests', 'nsu', 'payment.credit_card_token', 'payment.installments'];
    const transaction = await db.sequelize.transaction();

    try {
        const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
        if (requestValid) {
            await transaction.rollback();
            return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields });
        }

        const checkRoomIsAvailable = await validators.bookingValidator.checkRoomIsAvailable(req.body);
        if (checkRoomIsAvailable.error) {
            await transaction.rollback();
            return res.status(400).json({ message: checkRoomIsAvailable.error });
        }

        const calculateBooking = await services.bookingService.calculateBooking(req.body);
        const booking = await Booking.create(calculateBooking, { transaction });

        booking.nsu = req.body.nsu;
        booking.CreditCard = req.body.payment.credit_card_token;
        const request = {};
        request.nsu = booking.nsu;
        request.creditCard = req.body.payment.credit_card_token;
        const transactionMessage = buildTransactionMessage(booking, request);
        
        const checkTransaction = await services.transactionService.checkTransaction(booking, request);
        if(checkTransaction.error){
            await transaction.rollback();
            return res.status(400).json({ message: checkTransaction.error });
        }
        await db.transaction.create({
            nsu: booking.nsu,
            amount: booking.total_value,
            currency: 'BRL',
            installments: req.body.payment.installments,
            credit_card_token: req.body.payment.credit_card_token,
            status_id: constants.status.TRANSACTION_STATUS.PENDING,
        });

        const sqsService = new SqsService();
        await sqsService.sendMessage(transactionMessage);

        await transaction.commit();

        return res.status(201).json({ message: 'Success', data: booking });
    } catch (error) {
        await transaction.rollback();
        logger.error(error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Cancel booking
route.put('/:id/cancel', validateToken, async (req, res) => {
    const Booking = db.bookings;
    const bookingId = req.params.id;
    try {
        const booking = await Booking.findOne({
            where: { id: bookingId }
        });
        if (!booking) return res.status(404).json({ message: 'Booking not found!', bookingId: bookingId });

        const status = await db.booking_status.findOne({
            where: { description: 'Canceled' }
        });

        booking.status_id = status.id;
        await booking.save();

        const sqsService = new SqsService();
        await sqsService.sendMessage('Cancel Reserve');

        return res.status(200).json({ message: 'Success', data: booking });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.post('/card', validateToken, async (req, res) => {
    const requiredFields = ['customer_name', 'card_number', 'holder', 'expiration_date'];
    try {
        const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
        if (requestValid) {
            return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields });
        }

        const cardToken = await services.cardService.CieloCardToken(req.body);

        return res.status(200).json({ message: 'Success', data: cardToken });
    } catch(error) {
        logger.error(error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.post('/confirm', validateToken, async (req, res) => {
    const Booking = db.bookings;
    const Transaction = db.bookings;

    try {
        if (!req.body.Payment.Status != constants.status.CIELO_PAYMENT_STATUS.PAYMENT_CONFIRMED) {
            return res.status(400).json({ message: 'Payment not confirmed' });
        }

        const updateTransaction = await services.transactionService.updateTransaction(req.body);
        if (updateTransaction.error) {
            return res.status(400).json({ message: updateTransaction.error });
        }

        const updateBooking = await services.bookingService.updateBooking(req.body, updateTransaction);
        if(updateBooking.error){
            return res.status(400).json({ message: updateBooking.error });
        }
        
        return true;
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.get('/teste/caralho/', validateToken, async (req, res) => {
    const bookings = await db.bookings.findOne({
        where: { hotel_id: 1 },
        include: [
            { model: db.booking_status, as: 'status' },
            { model: db.users, as: 'user' },
            { model: db.hotel_rooms, as: 'hotel_room' },
            { model:db.hotels, as: 'hotel'},
        ]
    });

    const hotel = await db.hotels.findOne({
        where: { id: bookings.hotel_id},
        include: [
            { model: db.address, as: 'address'}
        ]
    });

    const user = await db.users.findOne({
        where: { id: bookings.user_id },
        include: [
            {
                model: db.address, as: 'address',
                include: [
                    { model: db.cities, as: 'city' },
                    { model: db.countries, as: 'country' }
                ]
            },
        ]
    });

    const transactionMessage = {
        Customer: {
            Address: {
                Street: user.address.street,
                Number: user.address.number,
                Complement: user.address.complement,
                ZipCode: user.address.postal_code,
                City: user.address.city.name,
                State: user.address.city.uf,
                Country: user.address.country.name
            },
            Name: user.name,
            Email: user.email,
        },
        Payment: {
            Type: "CreditCard",
            CreditCard: {
                CardToken: "b8cf9ec3-9747-46e7-a697-fac023a75c2f"
            },
            Currency: "BRL",
            Country: "BRA",
            ServiceTaxAmount: 0,
            Installments: 1,
            Interest: "ByMerchant",
            Capture: true,
            Recurrent: "false",
            SoftDescriptor: hotel.name,
            Amount: parseInt(bookings.total_value.toString().replace('.', ''))
        },
        MerchantOrderId: "0000001"
    };

    return res.status(200).json({ message: 'Success', data: transactionMessage });
});

export default route;