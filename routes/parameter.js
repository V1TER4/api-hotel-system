import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
import constants from '../constants/index.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';

const route = express.Router();

route.get('/', validateToken, async (req, res) => {
    const Parameter = db.parameter;

    try {
        const parameters = await Parameter.findAll();

        return res.status(200).json({ message: 'Success', data: parameters });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.get('/:id', validateToken, async (req, res) => {
    try {
        const Parameter = db.parameters;
        const parameters = await Parameter.findAll({
            where: { id: req.params.id }
        });

        return res.status(200).json({ message: 'Success', data: parameters });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

route.put('/', validateToken, async (req, res) => {
    const Parameter = db.parameter;
    const parametersToUpdate = req.body;

    if (!parametersToUpdate || Object.keys(parametersToUpdate).length === 0) {
        return res.status(400).json({ message: 'No data sent for update.' });
    }

    try {
        const updatePromises = Object.values(parametersToUpdate).map((item) => 
            Parameter.update(
                { value: item.value },
                { where: { id: item.id } }
            )
        );
        await Promise.all(updatePromises);

        return res.status(200).json({ message: 'Success', data: await Parameter.findAll() });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default route;