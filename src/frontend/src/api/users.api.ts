import { api } from "./ky-api";

export async function handleLogin( username: string, password: string): Promise<Response> {
    return api.post('users/login', { json: { username: username, password: password } }); 
}
