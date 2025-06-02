import { getForecast, getHistory } from "../../src/weather/weather-controller";
import { Request, Response } from "express";
import { Forecast, History } from "../../src/types/weatherTypes";

jest.mock("openmeteo", () => ({
    fetchWeatherApi: jest.fn()
}));

const { fetchWeatherApi } = require("openmeteo");

describe("weather-controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    describe("getForecast", () => {
        it("should respond with weather data on success", async () => {
            const mockHourly = {
                time: () => 0,
                timeEnd: () => 12,
                interval: () => 6,
                variables: (idx: number) => ({
                    valuesArray: () =>
                        idx === 0
                            ? new Float32Array([1, 2])
                            : new Float32Array([10, 20])
                })
            };
            const mockResponse = {
                utcOffsetSeconds: () => 0,
                hourly: () => mockHourly
            };
            (fetchWeatherApi as jest.Mock).mockResolvedValue([mockResponse]);

            await getForecast(req as Request, res as Response);

            const expected: Forecast = {
                time: [new Date(0), new Date(6000)],
                precipitation: new Float32Array([1, 2]),
                temperature2m: new Float32Array([10, 20])
            };

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expected);
        });

        it("should handle errors and respond with 500", async () => {
            (fetchWeatherApi as jest.Mock).mockRejectedValue(new Error("fail"));

            await getForecast(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });

    describe("getHistory", () => {
        it("should respond with history data on success", async () => {
            const mockHourly = {
                time: () => 0,
                timeEnd: () => 12,
                interval: () => 6,
                variables: () => ({
                    valuesArray: () => new Float32Array([10, 20])
                })
            };
            const mockResponse = {
                utcOffsetSeconds: () => 0,
                hourly: () => mockHourly
            };
            (fetchWeatherApi as jest.Mock).mockResolvedValue([mockResponse]);

            await getHistory(req as Request, res as Response);

            const expected: History = {
                time: [new Date(0), new Date(6000)],
                temperature2m: new Float32Array([10, 20])
            };

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expected);
        });

        it("should handle errors and respond with 500", async () => {
            (fetchWeatherApi as jest.Mock).mockRejectedValue(new Error("fail"));

            await getHistory(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });
});
