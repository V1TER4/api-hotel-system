import express from 'express';
import db from '../models/index.js';
import { Op } from 'sequelize';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';

const route = express.Router();
// Create user
route.post('/create', validateToken, async(req, res) => {
    const requiredFields = [
        'name', 'password', 'email', 'user_type_id', 'status_id', 'telephone', 'address.street', 'address.number', 'address.district', 
        'address.city_id', 'address.country_id', 'address.postal_code', 'address.state_id'
    ];
    const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
    if (requestValid) return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })

    try {
        const validUser = await validators.userValidator.createUser(req.body);
        if (validUser) return res.status(409).json({ message: validUser.error })

        const validAddress = await validators.addressValidator.createAddress(req.body);
        if (validAddress) return res.status(409).json({ message: validAddress.error })

        const { street, number, district, city_id, state_id, country_id, postal_code } = req.body.address;
        const newAddress = new db.address({ street, number, district, city_id, state_id, country_id, postal_code });
        await newAddress.save();

        req.body.password = await validators.passwordValidator.encryptPassword(req.body.password) ;

        const { name, email, password, telephone, user_type_id, status_id } = req.body;
        const newUser = new db.users({ name, email, password, telephone, user_type_id, status_id, address_id: newAddress.id });
        await newUser.save();

        return res.status(200).json({ message: 'Success', data: newUser })
    } catch (error) {
        return res.status(500).json({ 
            message: 'Internal Server Error', 
            errorMessage: error 
        });
    }
});

// List all users
route.get('/all', validateToken, async (req, res) => {
    const User = db.users;
    try {
        const { name, email, user_type_id, status_id } = req.body.filters;
        const filters = {};

        if (name) filters.name = { [Op.like]: `%{name}%` };
        if (email) filters.email = { [Op.like]: `%{email}%` };
        if (user_type_id) filters.user_type_id = user_type_id;
        if (status_id) filters.status_id = status_id;

        const users = await User.findAll({
            where: filters,
            include: [
                {
                    model: db.address,
                    as: 'address',
                    include: [
                        {
                            model: db.cities,
                            as: 'city'
                        },
                        {
                            model: db.countries,
                            as: 'country'
                        }
                    ]
                },
                {
                    model: db.user_types,
                },
                {
                    model: db.statuses
                }
            ]
        });

        return res.status(200).json({ message: 'Success', data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Get user by id
route.get('/:id', validateToken, async (req, res) => {
    const userId = req.params.id ;

    const User = db.users;
    const user = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: db.address,
                include: [
                    {
                        model: db.cities,
                        as: 'city'
                    },
                    {
                        model: db.countries,
                        as: 'country'
                    }
                ]
            },
            {
                model: db.user_types
            },
            {
                model: db.statuses
            }
        ]
    });
    if (!user)
        return res.status(404).json({ message: 'User not found!', userId: userId })

    return res.status(200).json({ message: 'Success', data: user })
});

// Update user
route.put('/:id', validateToken, async (req, res) => {
    const User = db.users;
    const userId = req.params.id;

    const requiredFields = [
        'name', 'user_type_id', 'status_id', 'address.street', 'address.number', 'address.district',
        'address.city_id', 'address.country_id', 'address.postal_code', 'address.state_id'
    ];
    
    try {
        const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
        if (requestValid) return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })
        
        const validUser = await validators.userValidator.updateUser(req.body, userId);
        if (validUser) return res.status(409).json({ message: validUser.error })

        const user = await User.findOne({
            where: {
                id: userId
            },
            include: [
                {
                    model: db.address,
                    include: [
                        {
                            model: db.cities,
                            as: 'city'
                        },
                        {
                            model: db.countries,
                            as: 'country',
                        }
                    ]
                },
                {
                    model: db.user_types
                },
                {
                    model: db.statuses
                }
            ]
        });
        if (!user) return res.status(404).json({ message: 'User not found!', userId: userId })
    
        // Updating adress
        const addressFields = ['street', 'number', 'district', 'city_id', 'country_id', 'postal_code'];
        addressFields.forEach(field => {
            if (req.body.address[field] !== undefined) {
                user.address[field] = req.body.address[field];
            }
        });
        await user.address.save(req.body.address);
        
        // Updating user
        const allowedFields = ['name', 'user_type_id', 'status_id'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined && field !== 'address') {
                user[field] = req.body[field];
            }
        });
        await user.save(req.body);
    
        return res.status(200).json({ message: 'Success', data: user })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.put('/password-reset/:id', validateToken, async (req, res) => {
    const User = db.users;
    const userId = req.params.id;

    const requiredFields = ['password'];
    try {
        const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
        if (requestValid.error) return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })

        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found!', userId: userId })

        req.body.password = await validators.passwordValidator.encryptPassword(req.body.password);
        const allowedFields = ['password'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save(req.body);

        return res.status(200).json({ message: 'Success', data: user })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.get('/:id/bookings', validateToken, async (req, res) => {
    const Booking = db.bookings;
    const userId = req.params.id;

    try {
        const bookings = await Booking.findAll({
            where: { user_id: userId },
            include: [
                { model: db.booking_status, as: 'status' },
                { model: db.hotel_rooms, as: 'hotel_room' },
                { model: db.hotels, as: 'hotel' },
            ]
        });

        return res.status(200).json({ message: 'Success', data: bookings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default route;