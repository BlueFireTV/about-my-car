import {query} from '../db';
import { Car, RegularService } from '../types/car';
import { User } from '../types/user';

export async function getAllCarsQuery(): Promise<Car[]> {
    const carArray = new Array<Car>();
    const carByIdSql = `SELECT * FROM car`;
    const carRows = await query(carByIdSql);

    if(carRows === null){
        return Promise.reject({ status: 500, message: 'Car not found' });
    }

    for (const carRow of carRows) {
        let car = {
            id: carRow.id,
            vin: carRow.vin,
            hsn: carRow.hsn,
            tsn: carRow.tsn,
            enginecode: carRow.enginecode,
            transmissioncode: carRow.transmissioncode,
            platenumber: carRow.platenumber,
            note: carRow.note,
            brand: carRow.brand,
            model: carRow.model,
            modelYear: carRow.model_year,
            initialApproval: carRow.initial_approval,
            vrdPicture: carRow.vrd_picture,
            regularServiceItem: [] as RegularService[]
        } as Car;

        carArray.push(car);
    }
    
    return carArray;
}

// Get single car by id
export async function getCarById(id: number): Promise<Car> {
    const carByIdSql = `SELECT * FROM car WHERE id = $1`;
    const carRows = await query(carByIdSql, [id]);

    if(carRows === null){
        return Promise.reject({ status: 500, message: 'Car not found' });
    }

    if (carRows.length === 0) {
        return Promise.reject({ status: 500, message: 'Car not found' });
    }

    const carRow = carRows[0];

    const car = {
        id: carRow.id,
        vin: carRow.vin,
        hsn: carRow.hsn,
        tsn: carRow.tsn,
        enginecode: carRow.enginecode,
        transmissioncode: carRow.transmissioncode,
        platenumber: carRow.platenumber,
        note: carRow.note,
        brand: carRow.brand,
        model: carRow.model,
        modelYear: carRow.model_year,
        initialApproval: carRow.initial_approval,
        picture: carRow.picture,
        vrdPicture: carRow.vrd_picture,
        regularServiceItem: [] as RegularService[]
    } as Car;

    car.regularServiceItem = await getRegularServiceItemByCarId(id);

    return car;
}

export async function getCarsByUserId(UserId: number): Promise<Car[]> {
    const carArray = new Array<Car>();
    const allCarsSql = `SELECT * FROM car WHERE User_id = $1`;
    const carRows = await query(allCarsSql, [UserId]);

    if(carRows === null){
        return Promise.reject({ status: 500, message: 'Car not found' });
    }

    for (const carRow of carRows) {
        let car = {
            id: carRow.id,
            vin: carRow.vin,
            hsn: carRow.hsn,
            tsn: carRow.tsn,
            enginecode: carRow.enginecode,
            transmissioncode: carRow.transmissioncode,
            platenumber: carRow.platenumber,
            note: carRow.note,
            brand: carRow.brand,
            model: carRow.model,
            modelYear: carRow.model_year,
            initialApproval: carRow.initial_approval,
            picture: carRow.picture,
            vrdPicture: carRow.vrd_picture,
            regularServiceItem: [] as RegularService[]
        } as Car;

        carArray.push(car);
    }

    return carArray;
}

export async function getRegularServiceItemByCarId(carId: number): Promise<RegularService[]> {
    const allRegularServiceItemsSql = `SELECT * FROM public.regularserviceitem WHERE car_id = $1`;
    const regularServiceItemRows = await query(allRegularServiceItemsSql, [carId]);

    if(regularServiceItemRows === null){
        return Promise.reject({ status: 500, message: 'Car not found' });
    }

    const regularServiceItemArray = new Array<RegularService>();

    for (const row of regularServiceItemRows) {
        let regularServiceItem = {
            id: row.id,
            name: row.name,
            date: formateDateUTCToLocal(row.date),
            interval: row.interval,
            note: row.note,
            carId: row.car_id,
            created: row.created,
        } as RegularService;

        regularServiceItemArray.push(regularServiceItem);
    }

    return regularServiceItemArray;
}

export async function setRegularServiceItemByCarId(carId: number, regularServices: RegularService[]): Promise<void> {
    try {
        // Fetch all IDs from the database
        const queryText = "SELECT id FROM public.regularserviceitem WHERE car_id = $1";
        const allIdsFromRegularServiceItems = await query(queryText, [carId]);

        if(allIdsFromRegularServiceItems === null){
            return Promise.reject({ status: 500, message: 'Car not found' });
        }

        // Extract IDs from the result
        const dbIds = allIdsFromRegularServiceItems.map((row: { id: number }) => row.id);

        // Extract IDs from the input regularServices
        const inputIds = regularServices.map((rsi) => rsi.id).filter((id) => id !== null);

        // Identify IDs to delete
        const idsToDelete = dbIds.filter((id) => !inputIds.includes(id));

        // Remove IDs that are no longer in regularServices
        if (idsToDelete.length > 0) {
            const deleteQuery = `DELETE FROM public.regularserviceitem WHERE id = ANY($1)`;
            await query(deleteQuery, [idsToDelete]);
        }

        // Insert or update regular services
        for (const rsi of regularServices) {
            if (rsi.id !== null && rsi.id >= 0) {
                console.log("Updating regular service item with ID:", rsi.id);
                await query(
                    `UPDATE regularserviceitem SET name = $1, date = $2, interval = $3, note = $4 WHERE id = $5`,
                    [rsi.name, rsi.date, rsi.interval, rsi.note, rsi.id]
                );
            } else {
                await query(
                    `INSERT INTO regularserviceitem (name, date, interval, note, car_id) VALUES ($1, $2, $3, $4, $5)`,
                    [rsi.name, rsi.date, rsi.interval, rsi.note, carId]
                );
            }
        }

    } catch (error) {
        console.error("Error:", error);
        return Promise.reject({ status: 400, message: error });
    }
}


function formateDateUTCToLocal(date: Date): Date 
{
    let newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
}


export async function createCarToUser(User: User): Promise<number> {

    const newCar = User.car;


    const carResult = await query(
        `INSERT INTO Car (vin, hsn, tsn, enginecode, transmissioncode, platenumber, brand, model, model_year, initial_approval, vrd_picture, note, User_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
         RETURNING id`,
        [
          newCar.vin,
          newCar.hsn,
          newCar.tsn,
          newCar.enginecode,
          newCar.transmissioncode,
          newCar.platenumber,
          newCar.brand,
          newCar.model,
          newCar.modelYear,
          newCar.initialApproval,
          newCar.vrdPicture,
          newCar.note,
          User.id,
        ]
    ) as { id: number }[];

    return carResult[0].id;
}

export async function getNextRegularServices(): Promise<any> {
    try {
        const queryCmd = `SELECT * FROM public.NextRegularServicesView ORDER BY service_due ASC`
        const result = await query(queryCmd);

        if(result === null){
            return Promise.reject({ status: 500, message: 'RegularService not found' });
        }   

        return result;
    } catch (error) {
        return Promise.reject({ status: 500, message: error });
    }
}   

export async function updateCarById(carId: number, car: Car): Promise<Car> {
    await query(
        `UPDATE Car SET hsn = $1, tsn = $2, enginecode = $3, transmissioncode = $4, platenumber = $5, brand = $6, model = $7, model_year = $8, note = $9, initial_approval = $10 WHERE id = $11`,
        [
            car.hsn,
            car.tsn,
            car.enginecode,
            car.transmissioncode,
            car.platenumber,
            car.brand,
            car.model,
            car.modelYear,
            car.note,
            car.initialApproval,

            carId,
        ]
    );

    return car;
}

export async function deleteCarById(carId: number): Promise<void> {
    await query(`DELETE FROM Car WHERE id = $1`, [carId]);
}
