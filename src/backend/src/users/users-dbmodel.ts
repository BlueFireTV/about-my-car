import {query} from '../db';
import {User} from '../types/user';

export async function getOne(username: string): Promise<User> {
    try {
       
      const result = await query('SELECT * FROM public.users WHERE username = $1', [username]) as User[];
       
      return result[0];
    } catch (error) {
       
      throw error;
    }
  }

  export async function create(user: User): Promise<User | null> {
    try {
      const result = await query('INSERT INTO public.users (username, password, surname, name, phone, permissionlevel) VALUES ($1, $2, $3, $4) RETURNING id', [user.username, user.password, user.surname, user.name]) as { id: string }[];
      const id = result[0].id;

      user = { ...user, id: Number(id) };
  
      return user;
    } catch (error) {
       
      return null;
    }
  }