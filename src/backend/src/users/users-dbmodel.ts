import {query} from '../db';
import {User} from '../types/user';

export async function getOne(username: string): Promise<User> {
    try {
       
      const result = await query('SELECT * FROM public.users WHERE username = $1', [username]) as User[];
       
      return result[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      return Promise.reject(new Error('User not found'));
    }
  }