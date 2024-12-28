import express from 'express';
import db from '../models/index.js';
import services from '../services/index.js';
import validators from '../validators/index.js';

const route = express.Router();

route.post('/login', async (req, res) => {
    const User = db.users;
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        });

        if(!user)
            return res.status(404).json({ message: 'User or Password is incorrect!'})

        const validPassword = await validators.passwordValidator.validPassword(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'User or Password is incorrect!' })

        const validToken = await services.tokenService.validToken(user);
        if (!validToken) {
            const generateToken = await services.tokenService.generateToken(req.body);
            user.token = generateToken.token;
            await user.save();
        }

        return res.status(200).json({ message: 'Success', data: user})
    } catch (error) {
        console.log('============ Houve um erro no Login ================ ' + error);
        return res.status(400).json({ message: 'Erro interno do servidor', errorMessage: error });
    }
});

route.get('/teste', (req, res) => {
    res.send('Hello, world!');
});

export default route;

