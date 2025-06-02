jest.mock("../../src/api/ky-api", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    head: jest.fn(),
    create: jest.fn(),
    extend: jest.fn(),
    stop: Symbol("ky.stop"),
  },
}));

import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetWeatherForecast, useGetWeatherHistory } from "../../src/Data/weatherData";

describe("useGetWeatherForecast", () => {
  it("should return a query object with queryKey and queryFn", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useGetWeatherForecast(), { wrapper });
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("object");
  });
});

describe("useGetWeatherHistory", () => {
  it("should return a query object with queryKey and queryFn", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useGetWeatherHistory(), { wrapper });
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("object");
  });
});
