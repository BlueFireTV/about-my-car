import { fetchWeatherApi } from 'openmeteo';
import { Request, Response } from 'express';

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);


export async function getForecast(request: Request, response: Response) {
    try {
        const params = {
            "latitude": 47.8564,
            "longitude": 12.1225,
            "hourly": ["precipitation", "temperature_2m"],
            "timezone": "Europe/Berlin",
            "forecast_days": 16,
            "temporal_resolution": "hourly_6"
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        const responseData = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = responseData.utcOffsetSeconds();
        
        const hourly = responseData.hourly()!;

        const weatherData = {

                    forecast: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                precipitation: hourly.variables(0)!.valuesArray()!,
                temperature2m: hourly.variables(1)!.valuesArray()!,
                },

        };

        response.status(200).send(weatherData);

    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getHistory(request: Request, response: Response) {
    try {
        const params = {
            "latitude": 52.52,
            "longitude": 13.41,
            "start_date": "2024-03-31",
            "end_date": "2024-05-30",
            "hourly": "temperature_2m",
            "temporal_resolution": "hourly_6"
        };
        const url = "https://historical-forecast-api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        const responseData = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = responseData.utcOffsetSeconds();
        
        const hourly = responseData.hourly()!;

        const weatherData = {

                history: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            },

        };

        response.status(200).send(weatherData);

    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Internal Server Error" });
    }
}