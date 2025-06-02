import { auth, CustomRequest } from "../../src/auth/authMiddleware";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

describe("auth middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should call next and set token if valid", async () => {
        (req.header as jest.Mock).mockReturnValue("Bearer validtoken");
        (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });

        await auth(req as Request, res as Response, next);

        expect(jwt.verify).toHaveBeenCalledWith("validtoken", process.env.JWT_SECRET);
        expect((req as CustomRequest).token).toEqual({ userId: 1 });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should respond 401 if no token", async () => {
        (req.header as jest.Mock).mockReturnValue(undefined);

        await auth(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Please authenticate");
        expect(next).not.toHaveBeenCalled();
    });

    it("should respond 401 if jwt.verify throws", async () => {
        (req.header as jest.Mock).mockReturnValue("Bearer invalidtoken");
        (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error("bad token"); });

        await auth(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("Please authenticate");
        expect(next).not.toHaveBeenCalled();
    });
});
