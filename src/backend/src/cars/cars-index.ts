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

const carRouter = express.Router();


carRouter.get('/all/',getAllCars);
carRouter.get('/all/:id',getCarsByUser);

carRouter.post('/rsi/:carId',setRegularServiceItem);
carRouter.get('/rsi/:carId',getRegularServiceItem);


carRouter.post('/createCar', createCar);
carRouter.put('/updateCar/:carId', updateCar);
carRouter.delete('/deleteCar/:carId', deleteCar);

export default carRouter;