import { api } from "./ky-api.ts";
import { Car, RegularService } from "../types/car.ts";
import { User } from "../types/user.ts";
import Cookies from "js-cookie";

export async function getAllCars(): Promise<Car[]> {
    return await api.get(`cars/all/`).json();
}

export async function getCarByUser(id: number, logoutCallback: ()=> void): Promise<Car> {

    const token = Cookies.get('token');
    if (!token) {
        logoutCallback();
        return Promise.reject('No token');
    }

    const response = await api.get(`cars/all/${id}` , { headers : { Authorization: `Bearer ${token}` } });
    
    if (response.status === 401) {
        logoutCallback();
        Cookies.remove('token');
        return Promise.reject('401 Unauthorized');
    }

    return await response.json();
}

export async function getRegularServiceItem(carId: number): Promise<RegularService[]> {
    return await api.get(`cars/rsi/${carId}`).json();
}

export async function setRegularServiceItem(carId: number, regularServices: RegularService[]): Promise<void> {
    return await api.post(`cars/rsi/${carId}`, {json: regularServices}).json();
}

export async function addNewCar(user: User): Promise<number> {
    return await api.post(`cars/createCar`, {json: user}).json();
}

export async function updateCar(carId: number, car: Car): Promise<Car> {
    return await api.put(`cars/updatecars/${carId}`, {json: car}).json();
}

export async function deleteCar(carId: number): Promise<void> {
    return await api.delete(`cars/deletecars/${carId}`).json();
}

