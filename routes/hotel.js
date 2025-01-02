import express from 'express';
import db from '../models/index.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';
import constants from '../constants/index.js';
import { Op } from 'sequelize';

const route = express.Router();

// List all hotels
route.get('/all', validateToken, async (req, res) => {
    const Hotel = db.hotels;
    try {
        const { name, city_id } = req.body.filters;
        const filters = {};

        if (name) filters.name = { [Op.like]: `%${name}%` };
        if (city_id) filters['$address.city_id$'] = city_id;

        const hotels = await Hotel.findAll({
            where: { 
                ...
                filters,
                status_id: constants.status.STATUS.ACTIVE
            },
            include: [
                { model: db.statuses, as: 'status' },
                { model: db.companies, as: 'company' },
                { model: db.address, as: 'address' },
                { model: db.hotel_rooms, as: 'hotel_rooms' },
            ]
        })  

        return res.status(200).json({ message: 'Success', data: hotels });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get hotel by id
route.get('/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await db.hotels.findOne({
            where: { 
                ...
                filters, 
                id: hotelId 
            },
            include: [
                { model: db.address, as: 'address' },
                { model: db.companies, as: 'company' },
                { model: db.hotel_rooms, as: 'hotel_rooms' }
            ]
        });

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        return res.status(200).json({ data: hotel });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Create hotel
route.post('/create', validateToken, async(req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const requiredFields = [
            'name', 'email', 'document', 'status_id', 'telephone', 
            'address.street', 'address.number', 'address.district', 'address.city_id', 'address.country_id', 'address.postal_code', 'address.state_id', 
            'rooms'
        ];
        const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
        if (requestValid) return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })
        
        const validUser = await validators.hotelValidator.createHotel(req.body);
        if (validUser) return res.status(409).json({ message: validUser.error })

        const validAddress = await validators.addressValidator.createAddress(req.body);
        if (validAddress) return res.status(409).json({ message: validAddress.error })

        // Create address
        const { street, number, district, city_id, state_id, country_id, postal_code } = req.body.address;
        const newAddress = new db.address({ street, number, district, city_id, state_id, country_id, postal_code });
        await newAddress.save();
        
        // Create company
        const { name, document } = req.body;
        const companyType = constants.company.TYPES.HOTEL;
        const newCompany = new db.companies({ name, document, company_type_id: companyType });
        await newCompany.save();
        
        // Create hotel
        const { email, telephone, status_id } = req.body;
        const newHotel = new db.hotels({ name, email, telephone, status_id, address_id: newAddress.id, company_id: newCompany.id });
        await newHotel.save();
        
        // Process each room
        const rooms = req.body.rooms;
        let roomCount = 0;
        for (const key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                const { room_number, capacity, price, description } = rooms[key];
                const parsedPrice = parseFloat(price);
                if (isNaN(parsedPrice)) {
                    return res.status(400).json({ message: 'Invalid price format' });
                }
                const newHotelRoom = new db.hotel_rooms({ room_number, capacity, price: parsedPrice, description, hotel_id: newHotel.id });
                await newHotelRoom.save();
                roomCount++;
            }
        }

        await newHotel.update({ rooms: roomCount }, { transaction });

        await transaction.commit();
        
        return res.status(200).json({ message: 'Success', data: newHotel });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// update hotel
route.put('/:id', async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const hotelId = req.params.id;

        // update hotel
        const { email, telephone, status_id } = req.body;
        const hotel = await db.hotels.findOne({ where: { id: hotelId } });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        await hotel.update({ email, telephone, status_id }, { transaction });

        // update address
        const { street, number, district, city_id, state_id, country_id, postal_code } = req.body.address;
        const address = await db.address.findOne({ where: { id: hotel.address_id } });
        await address.update({ street, number, district, city_id, state_id, country_id, postal_code }, { transaction });

        // update company
        const { name, document } = req.body;
        const company = await db.companies.findOne({ where: { id: hotel.company_id } });
        await company.update({ name, document }, { transaction });

        // update rooms
        const rooms = req.body.rooms;
        for (const key in rooms) {
            if (rooms.hasOwnProperty(key)) {
                const { room_number, capacity, price, description } = rooms[key];
                const parsedPrice = parseFloat(price);
                if (isNaN(parsedPrice)) {
                    return res.status(400).json({ message: 'Invalid price format' });
                }
                const room = await db.hotel_rooms.findOne({ where: { id: rooms[key].id, hotel_id: hotelId } });
                if (room) {
                    await room.update({ room_number, capacity, price: parsedPrice, description }, { transaction });
                } else {
                    const newHotelRoom = new db.hotel_rooms({ room_number, capacity, price: parsedPrice, description, hotel_id: hotelId });
                    await newHotelRoom.save({ transaction });
                }
            }
        }

        await transaction.commit();
        return res.status(200).json({ message: 'Hotel updated successfully' });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default route;