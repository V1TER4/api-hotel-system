import express from 'express';
import db from '../models/index.js';
import services from '../services/index.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';

const route = express.Router();

// List all bookings by user
route.get('/:id', validateToken, async (req, res) => {
    try {
        const Booking = db.bookings;
        const bookings = await Booking.findAll({
            where: { hotel_id: req.params.id },
            include: [
                { model: db.statuses, as: 'status' },
                { model: db.users, as: 'user' },
                { model: db.hotel_rooms, as: 'hotel_room' },
            ]
        });

        return res.status(200).json({ message: 'Success', data: bookings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Create a booking
route.post('/', validateToken, async (req, res) => {
    const Booking = db.bookings;
    const requiredFields = ['user_id', 'room_id', 'check_in', 'check_out', 'total_guests'];
    try {
        const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
        if (requestValid) return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })

        const checkRoomIsAvailable = await validators.bookingValidator.checkRoomIsAvailable(req.body);
        if (checkRoomIsAvailable.error) return res.status(400).json({ message: checkRoomIsAvailable.error });

        const calculateBooking = await services.bookingService.calculateBooking(req.body);
        const booking = await Booking.create(calculateBooking);

        return res.status(201).json({ message: 'Success', data: booking });
    } catch (error) {
        console.error(error);
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

        return res.status(200).json({ message: 'Success', data: booking });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default route;