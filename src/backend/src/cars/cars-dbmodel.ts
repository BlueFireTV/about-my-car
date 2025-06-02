import {query} from '../db';
import { Car, RegularService } from '../types/car';

export async function getCarByUserId(UserId: number): Promise<Car> {
    const allCarsSql = `SELECT *  FROM public.cars WHERE User_id = $1`;
    const carRows = await query(allCarsSql, [UserId]);
    let car : Car = {} as Car;

    if(carRows === null){
        return Promise.reject(new Error('Car not found'));
    }

    const carRow = carRows[0];
         
    car.id = carRow.id;
    car.vin = carRow.vin;
    car.hsn = carRow.hsn;
    car.tsn = carRow.tsn;
    car.enginecode = carRow.enginecode;
    car.transmissioncode = carRow.transmissioncode;
    car.platenumber = carRow.platenumber;
    car.note = carRow.note;
    car.brand = carRow.brand;
    car.model = carRow.model;
    car.modelYear = carRow.model_year;
    car.initialApproval = carRow.initial_approval;
    car.vrdPicture = carRow.vrd_picture;
    car.regularServiceItem = [] as RegularService[];

    car.regularServiceItem = await getRegularServiceItemByCarId(carRow.id);
    
    return car;
}

export async function getRegularServiceItemByCarId(carId: number): Promise<RegularService[]> {
    const allRegularServiceItemsSql = `SELECT * FROM public.regularserviceitems WHERE car_id = $1`;
    const regularServiceItemRows = await query(allRegularServiceItemsSql, [carId]);

    if(regularServiceItemRows === null){
        return Promise.reject(new Error('Car not found'));
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
        const queryText = "SELECT id FROM public.regularserviceitems WHERE car_id = $1";
        const allIdsFromRegularServiceItems = await query(queryText, [carId]);

        if(allIdsFromRegularServiceItems === null){
            return Promise.reject(new Error('Car not found'));
        }

        // Extract IDs from the result
        const dbIds = allIdsFromRegularServiceItems.map((row: { id: number }) => row.id);

        // Extract IDs from the input regularServices
        const inputIds = regularServices.map((rsi) => rsi.id).filter((id) => id !== null);

        // Identify IDs to delete
        const idsToDelete = dbIds.filter((id) => !inputIds.includes(id));

        // Remove IDs that are no longer in regularServices
        if (idsToDelete.length > 0) {
            const deleteQuery = `DELETE FROM public.regularserviceitems WHERE id = ANY($1)`;
            await query(deleteQuery, [idsToDelete]);
        }

        // Insert or update regular services
        for (const rsi of regularServices) {
            if (rsi.id !== null && rsi.id >= 0) {
                console.log("Updating regular service item with ID:", rsi.id);
                await query(
                    `UPDATE public.regularserviceitems SET name = $1, date = $2, interval = $3, note = $4 WHERE id = $5`,
                    [rsi.name, rsi.date, rsi.interval, rsi.note, rsi.id]
                );
            } else {
                await query(
                    `INSERT INTO public.regularserviceitems (name, date, interval, note, car_id) VALUES ($1, $2, $3, $4, $5)`,
                    [rsi.name, rsi.date, rsi.interval, rsi.note, carId]
                );
            }
        }

    } catch (error) {
        console.error("Error:", error);
        return Promise.reject(new Error('Error while setting regular service items'));
    }
}


export function formateDateUTCToLocal(date: Date): Date 
{
    let newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
}