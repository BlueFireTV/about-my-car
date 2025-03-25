import express from 'express';
import {
    getCarsByUser,
    getRegularServiceItem,
    setRegularServiceItem,
    getAllCars,
    getNextRS,
    createCar,
    deleteCar,
    updateCar
} from './cars-controller';

const carRouter = express.Router();


carRouter.get('/all/',getAllCars);
carRouter.get('/all/:id',getCarsByUser);
carRouter.get('/nextRs/', getNextRS);

carRouter.post('/rsi/:carId',setRegularServiceItem);
carRouter.get('/rsi/:carId',getRegularServiceItem);


carRouter.post('/createCar', createCar);
carRouter.put('/updateCar/:carId', updateCar);
carRouter.delete('/deleteCar/:carId', deleteCar);

export default carRouter;