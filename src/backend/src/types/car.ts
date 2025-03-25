export type Car = {
    id: number;
    vin: string;  
    hsn: string;    
    tsn: string;
    enginecode: string;
    transmissioncode: string;
    platenumber: string;
    brand: string;
    model: string;
    modelYear: string;
    initialApproval: Date;
    picture: CarPicture[];
    regularServiceItem: RegularService[];
    note: string;
    vrdPicture: string;
};

export type CarPicture = {
    id: number;
    car_id: number;
    picture: string;
};

export type RegularService =  {
    id: number;
    name: string;
    date: Date;
    interval: number;
    note: string;
}