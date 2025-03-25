import { Car } from "./car";

export type User = {
    id: number;
    username: string;
    password: string;
    surname: string;
    name: string;
    car: Car;
}