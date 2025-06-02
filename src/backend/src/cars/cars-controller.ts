import {Request, Response} from "express";
import {getCarByUserId, setRegularServiceItemByCarId} from "./cars-dbmodel";



export async function getCarByUser(request: Request, response: Response) {
    let UserId = Number(request.params.id);

    response.json(await getCarByUserId(UserId));
}

export async function setRegularServiceItem(request: Request, response: Response) {
    try {
        let carId = Number(request.params.carId);
    
        response.json(await setRegularServiceItemByCarId(carId, request.body));
    } catch (error) {
        response.status(500).json({ message: error, body: request.body });
    }
}