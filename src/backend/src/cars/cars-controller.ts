import {Request, Response} from "express";
import {getCarsByUserId, getRegularServiceItemByCarId, getAllCarsQuery, createCarToUser, deleteCarById, updateCarById, getNextRegularServices, setRegularServiceItemByCarId} from "./cars-dbmodel";


export async function getAllCars(request: Request, response: Response) {
    response.json(await getAllCarsQuery());
}

export async function getCarsByUser(request: Request, response: Response) {
    let UserId = Number(request.params.id);

    response.json(await getCarsByUserId(UserId));
}

export async function getRegularServiceItem(request: Request, response: Response) {
    let carId = Number(request.params.carId);

    response.json(await getRegularServiceItemByCarId(carId));
}

export async function setRegularServiceItem(request: Request, response: Response) {
    try {
        let carId = Number(request.params.carId);
    
        response.json(await setRegularServiceItemByCarId(carId, request.body));
    } catch (error) {
        response.status(500).json({ message: error, body: request.body });
    }
}

export async function getNextRS(request: Request, response: Response) {
    try {
        const result = await getNextRegularServices();
        response.json(result);
      } catch (error) {
        console.error('Error getting next RegularServices at:', error);
        response.status(500).json({ message: 'Internal server error' });
      }
}

export async function createCar(request: Request, response: Response) {
    const car = await createCarToUser(request.body);
 
    if(car === null){
        response.status(400).json({ message: 'Couldnt create User' });
        return;
    }
    response.json(car); 
}

export async function updateCar(request: Request, response: Response) {
    let carId = Number(request.params.carId);
    let car = request.body;

    response.json(await updateCarById(carId, car));
}

export async function deleteCar(request: Request, response: Response) {
    let carId = Number(request.params.carId);

    response.json(await deleteCarById(carId));
}