import express from 'express';

import {
    loginUser
    
} from './users-controller';

const usersRouter = express.Router();

usersRouter.post('/login', loginUser );


export default usersRouter;