import express from 'express';
import db from '../models/index.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';

const route = express.Router();

// List all hotels
route.get('/all', validateToken, async (req, res) => {
    const User = db.users;
    try {
        const { name, email, user_type_id, status_id } = req.body.filters;
        const filters = {};

        if (name) filters.name = { [Op.like]: `%${name}%` };
        if (email) filters.email = { [Op.like]: `%${email}%` };
        if (user_type_id) filters.user_type_id = user_type_id;
        if (status_id) filters.status_id = status_id;

        const users = await User.findAll({
            where: filters
        });

        return res.status(200).json({ message: 'Success', data: users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.post('/create', validateToken, async(req, res) => {

});

export default route;