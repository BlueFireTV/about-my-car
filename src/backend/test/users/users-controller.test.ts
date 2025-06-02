import { loginUser } from "../../src/users/users-controller";
import * as usersDbModel from "../../src/users/users-dbmodel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../src/types/user";

jest.mock("../../src/users/users-dbmodel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("users-controller", () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });

    describe("loginUser", () => {
        it("should return token for valid credentials", async () => {
            req.body = { username: "foo", password: "bar" };
            const user: User = { id: 1, username: "foo", password: "hashed", surname: "Doe", name: "John", car: {} as any };
            (usersDbModel.getOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("token");
            process.env.JWT_SECRET = "secret";

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: "token" });
        });

        it("should return 401 for invalid credentials", async () => {
            req.body = { username: "foo", password: "bar" };
            (usersDbModel.getOne as jest.Mock).mockResolvedValue({ id: 1, username: "foo", password: "hashed", surname: "Doe", name: "John", car: {} as any });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ status: 401, message: "Invalid credentials" });
        });

        it("should return 401 if user not found", async () => {
            req.body = { username: "foo", password: "bar" };
            (usersDbModel.getOne as jest.Mock).mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ status: 401, message: "Invalid credentials" });
        });

        it("should return 500 on error", async () => {
            req.body = { username: "foo", password: "bar" };
            (usersDbModel.getOne as jest.Mock).mockRejectedValue(new Error("fail"));

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 500, message: "Internal server error" });
        });

        it("should throw if JWT_SECRET is not defined", async () => {
            req.body = { username: "foo", password: "bar" };
            const user: User = { id: 1, username: "foo", password: "hashed", surname: "Doe", name: "John", car: {} as any };
            (usersDbModel.getOne as jest.Mock).mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            const originalSecret = process.env.JWT_SECRET;
            delete process.env.JWT_SECRET;

            // Call and check for error after execution, since the controller catches and handles the error
            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ status: 500, message: "Internal server error" });

            process.env.JWT_SECRET = originalSecret;
        });
    });
});
