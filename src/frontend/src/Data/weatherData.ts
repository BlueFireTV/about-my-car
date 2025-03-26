import { useSuspenseQuery } from "@tanstack/react-query";
import { getWeatherForecast, getWeatherHistory } from "../api/weather.api";

export function useGetWeatherHistory() {
    return useSuspenseQuery({
        queryKey: ['weatherHistory'],
        queryFn: () => getWeatherHistory()
    });
}

export function useGetWeatherForecast() {
    return useSuspenseQuery({
        queryKey: ['weatherForecast'],
        queryFn: () => getWeatherForecast()
    });
}