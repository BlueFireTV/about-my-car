import * as usersDbModel from "../../src/users/users-dbmodel";
import { query } from "../../src/db";
import { User } from "../../src/types/user";

jest.mock("../../src/db", () => ({
    query: jest.fn()
}));

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
    (console.error as jest.Mock).mockRestore();
});

describe("users-dbmodel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getOne", () => {
        it("should return user if found", async () => {
            const mockUser: User = { id: 1, username: "foo", password: "bar", surname: "Doe", name: "John", car: {} as any };
            (query as jest.Mock).mockResolvedValue([mockUser]);
            const result = await usersDbModel.getOne("foo");
            expect(result).toEqual(mockUser);
        });

        it("should return undefined if not found", async () => {
            (query as jest.Mock).mockResolvedValue([]);
            const result = await usersDbModel.getOne("foo");
            expect(result).toBeUndefined();
        });

        it("should throw 'User not found' on db error", async () => {
            (query as jest.Mock).mockRejectedValue(new Error("fail"));
            await expect(usersDbModel.getOne("foo")).rejects.toThrow("User not found");
        });
    });
});
