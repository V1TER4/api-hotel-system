import express, { response } from 'express';
import bodyParser from 'body-parser';
import auth from './routes/auth.js';
import user from './routes/user.js';
import env from 'dotenv';
import cors from 'cors';
import db from './models/index.js';

env.config();

const app = express()

app.use(cors());
app.use(bodyParser.json());

app.get('/index', (req, res) => {
    res.send("AQUI: " + process.env.DB_NAME)
})

app.use('/auth', auth);

app.use('/api/user', user);

(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Conexão com o banco de dados foi bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
    }
})();

app.listen(3000)