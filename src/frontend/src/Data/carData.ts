import { useSuspenseQuery } from "@tanstack/react-query";
import {getCarByUser, getAllCars} from "../api/cars.api.ts";

export function useGetAllCars() {
    return useSuspenseQuery({
        queryKey: ['allCars'],
        queryFn: () => getAllCars()
    });
}

export function useGetCarByUser(id: number, logoutCallback: () => void) {
    return useSuspenseQuery({
        queryKey: ['usercar', id],
        queryFn: () => getCarByUser(Number(id), logoutCallback)
    });
}
