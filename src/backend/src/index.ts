import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import carsRouter from './cars/cars-index';
import usersRouter from './users/users-index';

dotenv.config();
const app = express();
const PORT = process.env.PORT || "undefined";
 var corsOptions = {
     origin: [/http:\/\/localhost:\d{4}/, /http:\/\/192.168.178.37:\d{4}/, /https:\/\/schurzmann.myds.me:\d{4}/],
     optionsSuccessStatus: 200
 };

 app.use(cors(corsOptions));



app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/users', usersRouter);
app.use('/api/cars', carsRouter);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    }
);





