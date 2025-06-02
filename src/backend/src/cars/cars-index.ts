import express from 'express';
import { auth } from '../auth/authMiddleware';

import {
    getCarByUser,
    setRegularServiceItem
} from './cars-controller';

const carsRouter = express.Router();

carsRouter.get('/all/:id', auth, getCarByUser);

carsRouter.post('/rsi/:carId', auth, setRegularServiceItem);

export default carsRouter;