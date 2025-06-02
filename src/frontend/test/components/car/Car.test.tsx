import { render, screen, fireEvent } from '@testing-library/react';
import CarDetail from '../../../src/components/Car/Car';
import { AuthContext } from '../../../src/context/AuthContext';
import { useGetCarByUser } from '../../../src/Data/carData.ts';

// Mock CSS imports for Jest
jest.mock('../../../src/components/Car/Car.css', () => ({}));
jest.mock('../../../src/components/Car/RsiEdit', () => () => <div data-testid="rsi-edit-dialog" />);
jest.mock('../../../src/components/General/Header.tsx', () => () => <div data-testid="header" />);
jest.mock('../../../src/components/Spinner/Spinner.tsx', () => () => <div data-testid="spinner" />);
jest.mock('../../../src/components/Car/Wrapper/formWrapper.css', () => ({}));

// Mock useGetCarByUser hook
jest.mock('../../../src/Data/carData.ts', () => ({
  useGetCarByUser: jest.fn(),
}));

const mockCar = {
  id: 1,
  vin: 'VIN123',
  hsn: '1234',
  tsn: '567',
  enginecode: 'ENG123',
  transmissioncode: 'AUTO',
  platenumber: 'PLATE123',
  brand: 'TestBrand',
  model: 'TestModel',
  modelYear: '2022',
  initialApproval: new Date('2020-01-01'),
  regularServiceItem: [
    {
      id: 1,
      name: 'Ölwechsel',
      date: new Date(),
      interval: 12,
      note: '',
    },
  ],
  note: 'Testnote',
  vrdPicture: '',
};

const mockUser = {
  id: 1,
  username: 'testuser',
  password: 'testpass',
  surname: 'TestSurname',
  name: 'TestName',
  car: mockCar,
};

const mockLogout = jest.fn();

function setupContextAndRender({ carLoading = false, carError = null, car = mockCar } = {}) {
  (useGetCarByUser as jest.Mock).mockReturnValue({
    data: car,
    isLoading: carLoading,
    error: carError,
  });

  return render(
    <AuthContext.Provider
      value={{
        isLoggedIn: true,
        user: mockUser,
        login: jest.fn(),
        logout: mockLogout,
      }}
    >
      <CarDetail />
    </AuthContext.Provider>
  );
}

describe('<CarDetail />', () => {
  it('renders spinner if loading', () => {
    setupContextAndRender({ carLoading: true });
    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('renders car details and service table', () => {
    setupContextAndRender();
    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByText(/TestBrand TestModel/i)).toBeTruthy();
    expect(screen.getByText(/Ölwechsel/i)).toBeTruthy();
    expect(screen.getByText(/Testnote/i)).toBeTruthy();
    expect(screen.getByText(/Regelmäßige Service-Elemente/i)).toBeTruthy();
  });

  it('opens RsiEdit dialog when edit button is clicked', () => {
    setupContextAndRender();
    const editButton = screen.getByLabelText(/Regelmäßige Service-Elemente bearbeiten/i);
    fireEvent.click(editButton);
    expect(screen.getByTestId('rsi-edit-dialog')).toBeTruthy();
  });
});
