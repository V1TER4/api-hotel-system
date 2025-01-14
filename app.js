import express, { response } from 'express';
import bodyParser from 'body-parser';
import * as routes from './routes/index.js';
import env from 'dotenv';
import cors from 'cors';
import db from './models/index.js';

env.config();

const app = express();
const PORT = process.env.PORT;

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

(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Conexão com o banco de dados foi bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
    }
})();

app.listen(PORT)