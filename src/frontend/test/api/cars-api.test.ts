import { getCarByUser, setRegularServiceItem } from '../../src/api/cars.api';
import * as Cookies from 'js-cookie';
import { api } from '../../src/api/ky-api';
import { Car, RegularService } from '../../src/types/car';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('../../src/api/ky-api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('cars.api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCarByUser', () => {
    const userId = 1;
    let logoutMock: jest.Mock;

    beforeEach(() => {
      logoutMock = jest.fn();
    });

    it('should call logoutCallback and throw if no token is present', async () => {
      (Cookies as any)['get'].mockReturnValue(undefined);

      await expect(getCarByUser(userId, logoutMock)).rejects.toThrow('No token');
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect((api.get as jest.Mock)).not.toHaveBeenCalled();
    });

    it('should call logoutCallback, remove token, and throw if api.get returns 401', async () => {
      (Cookies as any)['get'].mockReturnValue('valid-token');
      (api.get as jest.Mock).mockResolvedValue({ status: 401 });

      await expect(getCarByUser(userId, logoutMock)).rejects.toThrow('401 Unauthorized');
      expect(logoutMock).toHaveBeenCalledTimes(1);
      (Cookies as any)['remove'].mock;
      expect((Cookies as any)['remove']).toHaveBeenCalledWith('token');
      expect((api.get as jest.Mock)).toHaveBeenCalledWith(`cars/all/${userId}`, {
        headers: { Authorization: 'Bearer valid-token' },
      });
    });

    it('should return Car data when api.get returns 200', async () => {
      const fakeCar = { id: 42, vin: 'WVWZZZ', brand: 'VW', model: 'Golf', regularServiceItem: [] } as unknown as Car;
      (Cookies as any)['get'].mockReturnValue('valid-token');
      (api.get as jest.Mock).mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(fakeCar),
      });

      const result = await getCarByUser(userId, logoutMock);
      expect(result).toEqual(fakeCar);
      expect((api.get as jest.Mock)).toHaveBeenCalledWith(`cars/all/${userId}`, {
        headers: { Authorization: 'Bearer valid-token' },
      });
      expect(logoutMock).not.toHaveBeenCalled();
      expect((Cookies as any)['remove']).not.toHaveBeenCalled();
    });
  });

  describe('setRegularServiceItem', () => {
    const carId = 2;
    let logoutMock: jest.Mock;
    const dummyServices: RegularService[] = [{ id: 1, name: 'Test', date: new Date(), interval: 6, note: '' }];

    beforeEach(() => {
      logoutMock = jest.fn();
    });

    it('should call logoutCallback and throw if no token is present', async () => {
      (Cookies as any)['get'].mockReturnValue(undefined);

      await expect(setRegularServiceItem(carId, dummyServices, logoutMock)).rejects.toThrow('No token');
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect((api.post as jest.Mock)).not.toHaveBeenCalled();
    });

    it('should call logoutCallback, remove token, and throw if api.post returns 401', async () => {
      (Cookies as any)['get'].mockReturnValue('valid-token');
      (api.post as jest.Mock).mockResolvedValue({ status: 401 });

      await expect(setRegularServiceItem(carId, dummyServices, logoutMock)).rejects.toThrow('401 Unauthorized');
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect((Cookies as any)['remove']).toHaveBeenCalledWith('token');
      expect((api.post as jest.Mock)).toHaveBeenCalledWith(`cars/rsi/${carId}`, {
        json: dummyServices,
        headers: { Authorization: 'Bearer valid-token' },
      });
    });

    it('should resolve when api.post returns 200', async () => {
      (Cookies as any)['get'].mockReturnValue('valid-token');
      (api.post as jest.Mock).mockResolvedValue({ status: 200 });

      await expect(setRegularServiceItem(carId, dummyServices, logoutMock)).resolves.toBeUndefined();
      expect((api.post as jest.Mock)).toHaveBeenCalledWith(`cars/rsi/${carId}`, {
        json: dummyServices,
        headers: { Authorization: 'Bearer valid-token' },
      });
      expect(logoutMock).not.toHaveBeenCalled();
      expect((Cookies as any)['remove']).not.toHaveBeenCalled();
    });
  });
});