import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
import constants from '../constants/index.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';

const route = express.Router();

// List all rooms
route.get('/all', validateToken, async (req, res) => {
    const Room = db.hotel_rooms;
    
    const requiredFields = [
        'filters.hotel_id'
    ];
    const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
    if (requestValid) return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })
    
        try {
        const { name, hotel_id } = req.body.filters;
        const filters = {};

        if (name) filters.name = { [Op.like]: `%${name}%` };
        if (hotel_id) filters.hotel_id = hotel_id;

        const rooms = await Room.findAll({
            where: {
                ...filters
            },
            include: [
                { model: db.hotels, as: 'hotel' }
            ]
        })

        return res.status(200).json({ message: 'Success', data: rooms });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get room by id
route.get('/:id', validateToken, async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await db.hotel_rooms.findOne({
            where: {
                id: roomId
            },
            include: [
                { model: db.hotels, as: 'hotel' },
            ]
        });

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        return res.status(200).json({ message: 'Success', data: room });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default route;