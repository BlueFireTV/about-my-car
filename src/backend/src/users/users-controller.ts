import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getOne, create } from './users-dbmodel';
import { User } from '../types/user';

export async function loginUser(request: Request, response: Response) {
  const username = request.body.username;
  const password = request.body.password;
  try {
    let user = await getOne(username);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        user = { ...user, password: "" };
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined');
        }
        const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' });
        response.status(200).json({token: token});
      } else {
        response.status(401).json({ status: 401, message: 'Invalid credentials' });
      }
    } else {
      response.status(401).json({ status: 401, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    response.status(500).json({ status: 500, message: 'Internal server error' });
  }
}

export async function registerUser(request: Request, response: Response) {
  const user:User = request.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const createdUser = await create({ ...user, password: hashedPassword });
    if (createdUser == null) {
      response.status(400).json({ status: 400, message: 'Could not create user' });
      return;
    }
    response.status(201).json(user);
  }
  catch (error) {
    console.error('Error during registration:', error);
    response.status(500).json({ status: 500, message: 'Internal server error' });
  }
}
