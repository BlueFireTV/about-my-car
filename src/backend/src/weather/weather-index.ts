import express from 'express';

import {
    getHistory,
    getForecast
    
} from './weather-controller';

const weatherRouter = express.Router();

weatherRouter.get('/history', getHistory );
weatherRouter.get('/forecast', getForecast );


export default weatherRouter;