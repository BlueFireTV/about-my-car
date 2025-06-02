import { query } from '../../src/db';
import {
  getCarByUserId,
  getRegularServiceItemByCarId,
  setRegularServiceItemByCarId,
  formateDateUTCToLocal,
} from '../../src/cars/cars-dbmodel';
import { Car, RegularService } from '../../src/types/car';

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));

const mockedQuery = query as jest.MockedFunction<typeof query>;

describe('cars-dbmodel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCarByUserId', () => {
    it('sollte ein Car-Objekt mit RegularService-Items zurückgeben, wenn Datensätze existieren', async () => {
      // 1. Mock für das Car-SELECT
      const fakeCarRow = {
        id: 42,
        vin: 'WVWZZZ1JZXW000001',
        hsn: '0123',
        tsn: '456',
        enginecode: 'EA888',
        transmissioncode: 'DSG',
        platenumber: 'B-MA-1234',
        note: 'Test-Note',
        brand: 'VW',
        model: 'Golf',
        model_year: 2020,
        initial_approval: new Date('2020-05-01T00:00:00Z'),
      };
      mockedQuery.mockResolvedValueOnce([fakeCarRow]); // erster Aufruf: Car-Query

      // 2. Mock für getRegularServiceItemByCarId
      const fakeServiceRows: any[] = [
        {
          id: 1,
          name: 'Ölwechsel',
          date: new Date('2021-01-10T12:00:00Z'),
          interval: 12,
          note: 'Keine',
        },
      ];
      // Beim zweiten Aufruf (RegularService-Query) geben wir dieselben Rows zurück
      mockedQuery.mockResolvedValueOnce(fakeServiceRows);

      const result: Car = await getCarByUserId(123);

      // Überprüfe, dass zuerst das korrekte SQL mit Parameter aufgerufen wurde
      expect(mockedQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT *  FROM public.cars WHERE User_id = $1',
        [123]
      );

      // anschließend sollte getRegularServiceItemByCarId das SQL aufgerufen haben
      expect(mockedQuery).toHaveBeenNthCalledWith(
        2,
        'SELECT * FROM public.regularserviceitems WHERE car_id = $1',
        [42]
      );

      // Ergebnis-Objekt prüfen
      expect(result.id).toBe(42);
      expect(result.vin).toBe('WVWZZZ1JZXW000001');
      expect(result.brand).toBe('VW');
      expect(result.model).toBe('Golf');
      expect(result.regularServiceItem).toHaveLength(1);
      expect(result.regularServiceItem[0].name).toBe('Ölwechsel');

      // Stelle sicher, dass die Datumskonvertierung angewendet wurde:
      // formateDateUTCToLocal zieht die Zeitzonen-Offset-Minuten ab.
      const convertedDate = formateDateUTCToLocal(fakeServiceRows[0].date);
      expect(result.regularServiceItem[0].date.getTime()).toBe(
        convertedDate.getTime()
      );
    });

    it('sollte einen Fehler werfen, wenn query null zurückgibt', async () => {
      mockedQuery.mockResolvedValueOnce(null);
      await expect(getCarByUserId(999)).rejects.toThrow('Car not found');
      expect(mockedQuery).toHaveBeenCalledWith(
        'SELECT *  FROM public.cars WHERE User_id = $1',
        [999]
      );
    });
  });

  describe('getRegularServiceItemByCarId', () => {
    it('sollte eine Liste von RegularService-Elementen zurückgeben', async () => {
      const fakeRows: any[] = [
        {
          id: 10,
          name: 'Bremsen prüfen',
          date: new Date('2022-03-15T08:00:00Z'),
          interval: 24,
          note: 'Achten auf Verschleiß',
        },
        {
          id: 11,
          name: 'Reifen wechseln',
          date: new Date('2023-10-20T09:30:00Z'),
          interval: 12,
          note: 'Sommerreifen',
        },
      ];
      mockedQuery.mockResolvedValueOnce(fakeRows);

      const items: RegularService[] = await getRegularServiceItemByCarId(7);

      expect(mockedQuery).toHaveBeenCalledWith(
        'SELECT * FROM public.regularserviceitems WHERE car_id = $1',
        [7]
      );
      expect(items).toHaveLength(2);
      expect(items[0].id).toBe(10);
      expect(items[0].name).toBe('Bremsen prüfen');
      // Datumskonvertierung prüfen
      const expectedDate0 = formateDateUTCToLocal(fakeRows[0].date);
      expect(items[0].date.getTime()).toBe(expectedDate0.getTime());
      expect(items[1].interval).toBe(12);
    });

    it('sollte einen Fehler werfen, wenn query null zurückgibt', async () => {
      mockedQuery.mockResolvedValueOnce(null);
      await expect(getRegularServiceItemByCarId(1234)).rejects.toThrow(
        'Car not found'
      );
      expect(mockedQuery).toHaveBeenCalledWith(
        'SELECT * FROM public.regularserviceitems WHERE car_id = $1',
        [1234]
      );
    });
  });

  describe('setRegularServiceItemByCarId', () => {
    it('sollte IDs löschen, die nicht mehr im Input sind, vorhandene updaten und neue einfügen', async () => {
      const carId = 5;
      // 1. SELECT id FROM ... -> liefert vorhandene IDs 100 und 200
      mockedQuery.mockResolvedValueOnce([
        { id: 100 },
        { id: 200 },
      ]);

      // Erstelle Testdaten:
      // - rsi1: vorhandenes Element, soll geupdated werden (id=100)
      // - rsi2: neu (id = null), soll eingefügt werden
      const now = new Date();
      const rsi1: RegularService = {
        id: 100,
        name: 'Filterwechsel',
        date: now,
        interval: 6,
        note: 'Filter prüfen',
      };
      const rsi2: RegularService = {
        id: 0,
        name: 'Kühlflüssigkeit prüfen',
        date: now,
        interval: 12,
        note: '',
      };

      // Für DELETE und die folgenden Updates/Inserts genügt es, resolved zu simulieren
      mockedQuery.mockResolvedValueOnce([]); // DELETE
      mockedQuery.mockResolvedValueOnce([]); // UPDATE für rsi1
      mockedQuery.mockResolvedValueOnce([]); // INSERT für rsi2

      await setRegularServiceItemByCarId(carId, [rsi1, rsi2]);

      // 1. SELECT id ... abgefragt
      expect(mockedQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM public.regularserviceitems WHERE car_id = $1',
        [carId]
      );

      // 2. DELETE für IDs, die nicht mehr im Input sind (hier nur id=200)
      expect(mockedQuery).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM public.regularserviceitems WHERE id = ANY($1)',
        [[200]]
      );

      // 3. UPDATE für rsi1 (id=100)
      expect(mockedQuery).toHaveBeenNthCalledWith(
        3,
        'UPDATE public.regularserviceitems SET name = $1, date = $2, interval = $3, note = $4 WHERE id = $5',
        [rsi1.name, rsi1.date, rsi1.interval, rsi1.note, rsi1.id]
      );

      // 4. UPDATE für rsi2 (id=null)
      expect(mockedQuery).toHaveBeenNthCalledWith(
        4,
        'UPDATE public.regularserviceitems SET name = $1, date = $2, interval = $3, note = $4 WHERE id = $5',
        [rsi2.name, rsi2.date, rsi2.interval, rsi2.note, rsi2.id]
      );
    });

    it('sollte nur Update ausführen, wenn keine vorhandenen IDs zurückgeliefert werden', async () => {
      const carId = 8;
      // 1. SELECT id ... -> leeres Array (keine vorhandenen IDs)
      mockedQuery.mockResolvedValueOnce([]);

      const item: RegularService = {
        id: 0,
        name: 'Scheibenwischer prüfen',
        date: new Date(),
        interval: 12,
        note: 'Jedes Jahr',
      };

      mockedQuery.mockResolvedValueOnce([]); // UPDATE für das einzige Element

      await setRegularServiceItemByCarId(carId, [item]);

      // SELECT id ...
      expect(mockedQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM public.regularserviceitems WHERE car_id = $1',
        [carId]
      );
      // UPDATE für das einzige Element
      expect(mockedQuery).toHaveBeenNthCalledWith(
        2,
        'UPDATE public.regularserviceitems SET name = $1, date = $2, interval = $3, note = $4 WHERE id = $5',
        [item.name, item.date, item.interval, item.note, item.id]
      );
    });

    it('sollte Error werfen, wenn SELECT id ... null zurückgibt', async () => {
      const carId = 99;
      mockedQuery.mockResolvedValueOnce(null);

      await expect(
        setRegularServiceItemByCarId(carId, [])
      ).rejects.toThrow('Car not found');

      expect(mockedQuery).toHaveBeenCalledWith(
        'SELECT id FROM public.regularserviceitems WHERE car_id = $1',
        [carId]
      );
    });

    it('sollte den INSERT-Zweig ausführen, wenn id < 0', async () => {
      const carId = 7;
      // 1. SELECT id ... -> liefert vorhandene ID 50
      mockedQuery.mockResolvedValueOnce([{ id: 50 }]);

      // Erstelle ein Element mit id < 0, damit es in den INSERT-Zweig fällt
      const now = new Date();
      const newItem: RegularService = {
        id: -1,
        name: 'Neuer Service',
        date: now,
        interval: 18,
        note: 'Test Insert',
      };

      // 2. DELETE (weil idsToDelete = [50])
      mockedQuery.mockResolvedValueOnce([]);
      // 3. INSERT für newItem
      mockedQuery.mockResolvedValueOnce([]);

      await setRegularServiceItemByCarId(carId, [newItem]);

      // 1. SELECT id ...
      expect(mockedQuery).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM public.regularserviceitems WHERE car_id = $1',
        [carId]
      );

      // 2. DELETE für IDs, die nicht mehr im Input sind (hier [50])
      expect(mockedQuery).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM public.regularserviceitems WHERE id = ANY($1)',
        [[50]]
      );

      // 3. INSERT-Zweig aufrufen: INSERT erwartet SQL und Parameter
      expect(mockedQuery).toHaveBeenNthCalledWith(
        3,
        `INSERT INTO public.regularserviceitems (name, date, interval, note, car_id) VALUES ($1, $2, $3, $4, $5)`,
        [newItem.name, newItem.date, newItem.interval, newItem.note, carId]
      );
    });

    it('sollte den Fehler-Zweig auslösen, wenn eine Query einen Fehler wirft', async () => {
      const carId = 10;
      // 1. SELECT id ... -> löst einen Fehler aus
      const testError = new Error('DB-Verbindungsfehler');
      mockedQuery.mockRejectedValueOnce(testError);

      await expect(
        setRegularServiceItemByCarId(carId, [])
      ).rejects.toThrow('Error while setting regular service items');

      // 1. SELECT id ... muss aufgerufen worden sein
      expect(mockedQuery).toHaveBeenCalledWith(
        'SELECT id FROM public.regularserviceitems WHERE car_id = $1',
        [carId]
      );
    });
  });

  describe('formateDateUTCToLocal', () => {
    it('sollte UTC-Zeit in lokale Zeit konvertieren (Offset abziehen)', () => {
      // Beispiel: 2021-06-01T12:00:00Z liegt in CET (UTC+1) um 13:00:00
      const utcDate = new Date(Date.UTC(2021, 5, 1, 12, 0, 0)); // 1. Juni 2021, 12:00 UTC
      const local = formateDateUTCToLocal(utcDate);

      // Wir berechnen den Offset-Minus, um von UTC auf lokale Zeit (Berlin) zu kommen:
      const offsetMin = utcDate.getTimezoneOffset(); // z.B. -120 für CEST im Sommer
      const expected = new Date(utcDate);
      expected.setMinutes(expected.getMinutes() - offsetMin);

      expect(local.getTime()).toBe(expected.getTime());
    });
  });
});