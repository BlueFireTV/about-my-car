import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432, 
  database: process.env.POSTGRES_NAME
});

export const query = async (text: string, params?: any[]) => {

    console.log('Query:', text, params);
     
    const client = await pool.connect();

    try {
        const res = await client.query(text, params);
        return res.rows;
    } catch (error) {
        console.error('Error during query:', error);
        return null;
    } finally {
        client.release();
    }
};