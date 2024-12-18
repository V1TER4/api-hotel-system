import express from 'express';
import db from '../models/index.js';
import validators from '../validators/index.js';
import { validateToken } from '../middlewares/tokenMiddleware.js';

const route = express.Router();

route.post('/create', validateToken, async(req, res) => {
    const requiredFields = ['name', 'password', 'email', 'user_type_id', 'status_id'];
    const requestValid = await validators.requestValidator.validateRequest(requiredFields, req);
    if (requestValid.error) {
        return res.status(401).json({ message: requestValid.error, missingField: requestValid.missingFields })
    }

    try {
        const validUser = await validators.userValidator.createUser(req.body);
        if (validUser.error) 
            return res.status(409).json({ message: validUser.error })

        req.body.password = await validators.passwordValidator.encryptPassword(req.body.password) ;

        const { name, email, password, user_type_id, status_id } = req.body;
        
        const newUser = new db.users({ name, email, password, user_type_id, status_id });
        await newUser.save();

        return res.status(200).json({ message: 'Sucesso', data: newUser })
    } catch (error) {
        console.log('============ ERRO ================' + error);
        return res.status(400).json({ 
            message: 'Erro interno do servidor', 
            errorMessage: error 
        });
    }
});

route.get('/teste', (req, res) => {
    res.send('Hello, world USER!');
});

export default route;