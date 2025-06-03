import { getWeatherForecast, getWeatherHistory } from '../../src/api/weather.api';
import { api } from '../../src/api/ky-api';

jest.mock('../../src/api/ky-api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('weather.api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherForecast', () => {
    it('should call api.get with correct arguments and return forecast', async () => {
      const fakeForecast = { foo: 'bar' };
      (api.get as jest.Mock).mockReturnValue({ json: jest.fn().mockResolvedValue(fakeForecast) });

      const result = await getWeatherForecast();
      expect(api.get).toHaveBeenCalledWith('weather/forecast');
      expect(result).toEqual(fakeForecast);
    });
  });

  describe('getWeatherHistory', () => {
    it('should call api.get with correct arguments and return history', async () => {
      const fakeHistory = { foo: 'baz' };
      (api.get as jest.Mock).mockReturnValue({ json: jest.fn().mockResolvedValue(fakeHistory) });

      const result = await getWeatherHistory();
      expect(api.get).toHaveBeenCalledWith('weather/history');
      expect(result).toEqual(fakeHistory);
    });
  });
});
