import { api } from "./ky-api.ts";
import { Car, RegularService } from "../types/car.ts";
import Cookies from "js-cookie";

export async function getCarByUser(id: number, logoutCallback: ()=> void): Promise<Car> {

    const token = Cookies.get('token');
    if (!token) {
        logoutCallback();
        return Promise.reject(new Error('No token'));
    }

    const response = await api.get(`cars/all/${id}` , { headers : { Authorization: `Bearer ${token}` } });
    
    if (response.status === 401) {
        logoutCallback();
        Cookies.remove('token');
        return Promise.reject(new Error('401 Unauthorized'));
    }

    return await response.json();
}

export async function setRegularServiceItem(carId: number, regularServices: RegularService[], logoutCallback: () => void): Promise<void> {
    const token = Cookies.get('token');
    if (!token) {
        logoutCallback();
        return Promise.reject(new Error('No token'));
    }

    const response = await api.post(`cars/rsi/${carId}`, { 
        json: regularServices, 
        headers: { Authorization: `Bearer ${token}` } 
    });

    if (response.status === 401) {
        logoutCallback();
        Cookies.remove('token');
        return Promise.reject(new Error('401 Unauthorized'));
    }

    return Promise.resolve();
}

