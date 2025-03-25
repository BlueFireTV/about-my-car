import { api } from "./ky-api";
import { User } from "../types/user";

export async function handleLogin( username: string, password: string): Promise<Response> {
    return api.post('users/login', { json: { username: username, password: password } }); 
}

export async function createUser(user: User): Promise<User> {
    return await api.post(`users/register`, { json: user }).json();
}