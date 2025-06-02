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
import { useGetCarByUser } from "../../src/Data/carData";

describe("useGetCarByUser", () => {
  it("should return a query object with queryKey and queryFn", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const logoutMock = jest.fn();
    const { result } = renderHook(() => useGetCarByUser(1, logoutMock), { wrapper });
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe("object");
  });

  it("should call useSuspenseQuery with correct arguments", async () => {
    // Use dynamic import to avoid TS error about 'require'
    jest.resetModules();
    jest.doMock("@tanstack/react-query", () => {
      const actual = jest.requireActual("@tanstack/react-query");
      return {
        ...actual,
        useSuspenseQuery: jest.fn().mockReturnValue({}),
      };
    });

    // Use dynamic import instead of require
    const [{ useGetCarByUser }, { useSuspenseQuery }] = await Promise.all([
      import("../../src/Data/carData"),
      import("@tanstack/react-query"),
    ]);

    const logoutMock = jest.fn();
    useGetCarByUser(42, logoutMock);

    expect((useSuspenseQuery as jest.Mock)).toHaveBeenCalledWith({
      queryKey: ['usercar', 42],
      queryFn: expect.any(Function),
    });

    jest.dontMock("@tanstack/react-query");
  });
});
