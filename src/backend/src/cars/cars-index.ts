import express from 'express';
import { auth } from '../auth/authMiddleware';

import {
    getCarsByUser,
    getRegularServiceItem,
    setRegularServiceItem,
    getAllCars,
    createCar,
    deleteCar,
    updateCar
} from './cars-controller';

const carsRouter = express.Router();

carsRouter.get('/all/', auth, getAllCars);
carsRouter.get('/all/:id', auth, getCarsByUser);

carsRouter.post('/rsi/:carId', auth, setRegularServiceItem);
carsRouter.get('/rsi/:carId', auth, getRegularServiceItem);

carsRouter.post('/createCar', auth, createCar);
carsRouter.put('/updateCar/:carId', auth, updateCar);
carsRouter.delete('/deleteCar/:carId', auth, deleteCar);

export default carsRouter;