import { useSuspenseQuery } from "@tanstack/react-query";
import {getCarByUser} from "../api/cars.api.ts";

export function useGetCarByUser(id: number, logoutCallback: () => void) {
    return useSuspenseQuery({
        queryKey: ['usercar', id],
        queryFn: () => getCarByUser(Number(id), logoutCallback)
    });
}
