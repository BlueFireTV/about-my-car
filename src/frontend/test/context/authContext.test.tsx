import { render, act } from "@testing-library/react";
import { AuthProvider, AuthContext, getUserFromCookie } from "../../src/context/AuthContext";
import Cookies from "js-cookie";
import { User } from "../../src/types/user";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

const mockUser: User = {
  id: 1,
  username: "foo",
  password: "bar",
  surname: "Doe",
  name: "John",
  car: {} as any,
};

describe("AuthContext", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should provide default values", () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    expect(contextValue.isLoggedIn).toBe(false);
    expect(contextValue.user).toBeNull();
    expect(typeof contextValue.login).toBe("function");
    expect(typeof contextValue.logout).toBe("function");
  });

  it("should login and set user in cookie", () => {
    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    act(() => {
      contextValue.login(mockUser);
    });
    expect(contextValue.isLoggedIn).toBe(true);
    expect(contextValue.user).toEqual(mockUser);
    expect(Cookies.set).toHaveBeenCalledWith("user", JSON.stringify(mockUser));
  });

  it("should logout and remove user/token cookies", () => {
    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    act(() => {
      contextValue.login(mockUser);
      contextValue.logout();
    });
    expect(contextValue.isLoggedIn).toBe(false);
    expect(contextValue.user).toBeNull();
    expect(Cookies.remove).toHaveBeenCalledWith("token");
    expect(Cookies.remove).toHaveBeenCalledWith("user");
  });

  it("getUserFromCookie returns user if cookie exists", () => {
    (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify(mockUser));
    expect(getUserFromCookie()).toEqual(mockUser);
  });

  it("getUserFromCookie returns null if no cookie", () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    expect(getUserFromCookie()).toBeNull();
  });

  it("should set user from cookie on mount", () => {
    const userCookie = JSON.stringify(mockUser);
    (Cookies.get as jest.Mock).mockReturnValue(userCookie);

    let contextValue: any;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    expect(contextValue.user).toEqual(mockUser);
    expect(contextValue.isLoggedIn).toBe(true);
  });
});
