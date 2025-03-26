import { Forecast, History } from "../types/weatherTypes";
import { api } from "./ky-api";

export async function getWeatherHistory(): Promise<History> {
    return api.get('weather/history').json(); 
}

export async function getWeatherForecast(): Promise<Forecast> {
    return api.get('weather/forecast').json(); 
}
