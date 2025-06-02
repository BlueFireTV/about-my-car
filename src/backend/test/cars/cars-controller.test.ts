import { getCarByUser, setRegularServiceItem } from "../../src/cars/cars-controller";
import * as carsDbModel from "../../src/cars/cars-dbmodel";
import { Car } from "../../src/types/car";

jest.mock("../../src/db", () => ({
    query: jest.fn()
}));

const mockCar: Car = {
    id: 1,
    vin: "VIN123",
    hsn: "HSN456",
    tsn: "TSN789",
    enginecode: "ENGCODE",
    transmissioncode: "TRANSCODE",
    platenumber: "PLATE123",
    brand: "TestBrand",
    model: "TestModel",
    modelYear: "2020",
    initialApproval: new Date("2020-01-01"),
    regularServiceItem: [
        {
            id: 1,
            name: "Oil Change",
            date: new Date("2023-01-01"),
            interval: 365,
            note: "Annual service"
        }
    ],
    note: "Test note",
    vrdPicture: "pic.png"
};

beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
    (console.log as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
});

describe("cars-controller", () => {
    describe("getCarByUser", () => {
        it("should respond with car data for a given user id", async () => {
            jest.spyOn(carsDbModel, "getCarByUserId").mockResolvedValue(mockCar);

            const req: any = { params: { id: "42" } };
            const res: any = { json: jest.fn() };

            await getCarByUser(req, res);

            expect(carsDbModel.getCarByUserId).toHaveBeenCalledWith(42);
            expect(res.json).toHaveBeenCalledWith(mockCar);
        });

        it("should handle errors and throw if db fails", async () => {
            jest.spyOn(carsDbModel, "getCarByUserId").mockRejectedValue(new Error("fail"));
            const req: any = { params: { id: "42" } };
            const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

            // getCarByUser does not catch errors, so it will throw
            await expect(getCarByUser(req, res)).rejects.toThrow("fail");
        });
    });

    describe("setRegularServiceItem", () => {
        it("should respond with updated car data when successful", async () => {
            jest.spyOn(carsDbModel, "setRegularServiceItemByCarId").mockResolvedValue(undefined);

            const req: any = { params: { carId: "7" }, body: { foo: "bar" } };
            const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

            await setRegularServiceItem(req, res);

            expect(carsDbModel.setRegularServiceItemByCarId).toHaveBeenCalledWith(7, { foo: "bar" });
            expect(res.json).toHaveBeenCalledWith(undefined);
        });

        it("should respond with 500 and error message on failure", async () => {
            jest.spyOn(carsDbModel, "setRegularServiceItemByCarId").mockRejectedValue(new Error("fail"));

            const req: any = { params: { carId: "7" }, body: { foo: "bar" } };
            const res: any = { json: jest.fn(), status: jest.fn().mockReturnThis() };

            await setRegularServiceItem(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: expect.any(Error), body: { foo: "bar" } });
        });
    });
});
