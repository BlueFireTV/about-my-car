import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import { getOne } from './users-dbmodel';

export async function loginUser(request: Request, response: Response) {
  const username = request.body.username;
  const password = request.body.password;
  try {
    let user = await getOne(username);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        user = { ...user, password: "" };
        response.status(200).json({ status: 200, message: 'Login successful' , user: user});
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
