import { render, screen } from "@testing-library/react";
import ForecastComponent from "../../../src/components/Weather/Forecast";

// Forecast.css stubben, damit kein Fehler kommt
jest.mock("../../../src/components/Weather/Forecast.css", () => ({}), { virtual: true });
jest.mock('../../../src/components/Spinner/Spinner.tsx', () => () => <div data-testid="spinner" />);

// Mocke das Wetter-Hook
jest.mock("../../../src/Data/weatherData", () => ({
  useGetWeatherForecast: jest.fn(),
}));

import { useGetWeatherForecast } from "../../../src/Data/weatherData";

// Beispiel Forecast Daten
const exampleForecast = {
  time: [
    "2024-06-01T12:00:00Z",
    "2024-06-02T12:00:00Z",
    "2024-06-03T12:00:00Z",
    "2024-06-04T12:00:00Z",
  ],
  precipitation: [0, 0, 0, 0], // kein Regen
  temperature2m: [12, 13, 14, 15], // über 8 Grad
};

describe("ForecastComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("zeigt Spinner während Loading", () => {
    (useGetWeatherForecast as jest.Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(<ForecastComponent />);
    expect(screen.getByTestId("spinner")).not.toBeNull();
  });

  it("zeigt Fehler, wenn keine Daten", () => {
    (useGetWeatherForecast as jest.Mock).mockReturnValue({
      isLoading: false,
      error: true,
      data: null,
    });

    render(<ForecastComponent />);
    expect(screen.getAllByText(/keine wetterdaten gefunden/i).length).toBeGreaterThan(0);
  });

  it("empfiehlt Waschen und keine Winterreifen bei Sonne und warm", () => {
    (useGetWeatherForecast as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: exampleForecast,
    });

    render(<ForecastComponent />);
    expect(screen.getByText(/ja, es regnet die nächten drei tage nicht/i)).not.toBeNull();
    expect(screen.getByText(/nein, es wird über 8 grad/i, { exact: false })).not.toBeNull();
  });

  it("empfiehlt KEIN Waschen bei Regen", () => {
    (useGetWeatherForecast as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        ...exampleForecast,
        precipitation: [2, 0, 0, 0], // Regen am ersten Tag!
      },
    });

    render(<ForecastComponent />);
    expect(screen.getByText((t) => /nein, es wird regnen/i.test(t))).not.toBeNull();
  });

  it("empfiehlt Winterreifen bei Kälte", () => {
    (useGetWeatherForecast as jest.Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: {
        ...exampleForecast,
        temperature2m: Array(16).fill(3),
      },
    });

    render(<ForecastComponent />);
    expect(screen.getByText(/ja, es wird die nächsten 16 tage unter 8 grad/i)).not.toBeNull();
  });
});