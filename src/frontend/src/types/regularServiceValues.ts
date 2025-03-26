
export enum RegularServiceValues {
    OilChange = "Ölwechsel",
    AirFilterChange = "Luftfilterwechsel",
    PollenFilterChange = "Pollenfilterwechsel",
    FuelFilterChange = "Kraftstofffilterwechsel",
    SparkPlugChange = "Zündkerzenwechsel",
    BrakeFluidChange = "Bremsflüssigkeitswechsel",
    TireChange = "Reifenwechsel",
}

export const RegularServiceDictionary: { [key in RegularServiceValues]: number } = {
    [RegularServiceValues.OilChange]: 12,
    [RegularServiceValues.AirFilterChange]: 48,
    [RegularServiceValues.PollenFilterChange]: 24,
    [RegularServiceValues.FuelFilterChange]: 48,
    [RegularServiceValues.SparkPlugChange]: 48,
    [RegularServiceValues.BrakeFluidChange]: 24,
    [RegularServiceValues.TireChange]: 6,
};
