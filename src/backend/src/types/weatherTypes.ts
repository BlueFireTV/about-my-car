export type Forecast = {
    time: Date[];
    precipitation: Float32Array;
    temperature2m: Float32Array;
}

export type History = {
    time: Date[];
    temperature2m: Float32Array;
}