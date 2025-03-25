import express from 'express';
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


carsRouter.get('/all/',getAllCars);
carsRouter.get('/all/:id',getCarsByUser);

carsRouter.post('/rsi/:carId',setRegularServiceItem);
carsRouter.get('/rsi/:carId',getRegularServiceItem);


carsRouter.post('/createCar', createCar);
carsRouter.put('/updateCar/:carId', updateCar);
carsRouter.delete('/deleteCar/:carId', deleteCar);

export default carsRouter;