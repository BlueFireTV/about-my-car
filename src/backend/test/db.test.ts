// Define mocks BEFORE importing db
const mockClient = {
    query: jest.fn(),
    release: jest.fn()
};
const mockConnect = jest.fn().mockResolvedValue(mockClient);

jest.mock("pg", () => ({
    Pool: jest.fn(() => ({
        connect: mockConnect
    }))
}));

import * as db from "../src/db";

describe("db module", () => {
    beforeAll(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterAll(() => {
        (console.log as jest.Mock).mockRestore();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return rows on successful query", async () => {
        mockClient.query.mockResolvedValue({ rows: [{ id: 1 }] });
        const result = await db.query("SELECT 1");
        expect(result).toEqual([{ id: 1 }]);
    });

    it("should return null and log error on query failure", async () => {
        const error = new Error("fail");
        mockClient.query.mockRejectedValue(error);
        const logSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const result = await db.query("SELECT 1");
        expect(result).toBeNull();
        expect(logSpy).toHaveBeenCalledWith("Error during query:", error);
        logSpy.mockRestore();
    });
});
