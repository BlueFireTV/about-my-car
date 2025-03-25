import express from 'express';
import {
    loginUser,
    createUser,
    updatePwUser
    
} from './users-controller';

const usersRouter = express.Router();

usersRouter.post('/login', loginUser );
usersRouter.post('/register', createUser );
usersRouter.post('/changepw', updatePwUser );

export default usersRouter;