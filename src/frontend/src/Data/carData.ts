import { useSuspenseQuery } from "@tanstack/react-query";
import {getCarByUser, getRegularServiceItem, getAllCars} from "../api/cars.api.ts";

//TODO QUERYS ABSCHAFFEN IN DIESEN FILES

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

export function useGetRegularServiceItem(carId: number) {
    return useSuspenseQuery({
        queryKey: ['rsi', carId],
        queryFn: () => getRegularServiceItem(carId)
    });
}

export function useGetNextRegularServiceByCarId(carId: number) {
    return useSuspenseQuery({
        queryKey: ["nextRegularServices", carId],
        queryFn: () => getRegularServiceItem(carId),
      });
}
