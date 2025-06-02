import { RegularServiceValues, RegularServiceDictionary } from '../../src/types/regularServiceValues';

describe('RegularServiceDictionary', () => {
  it('should map each RegularServiceValues to the correct interval', () => {
    expect(RegularServiceDictionary[RegularServiceValues.OilChange]).toBe(12);
    expect(RegularServiceDictionary[RegularServiceValues.AirFilterChange]).toBe(48);
    expect(RegularServiceDictionary[RegularServiceValues.PollenFilterChange]).toBe(24);
    expect(RegularServiceDictionary[RegularServiceValues.FuelFilterChange]).toBe(48);
    expect(RegularServiceDictionary[RegularServiceValues.SparkPlugChange]).toBe(48);
    expect(RegularServiceDictionary[RegularServiceValues.BrakeFluidChange]).toBe(24);
    expect(RegularServiceDictionary[RegularServiceValues.TireChange]).toBe(6);
  });

  it('should have all RegularServiceValues as keys', () => {
    const keys = Object.keys(RegularServiceDictionary);
    Object.values(RegularServiceValues).forEach(value => {
      expect(keys).toContain(value);
    });
  });
});
