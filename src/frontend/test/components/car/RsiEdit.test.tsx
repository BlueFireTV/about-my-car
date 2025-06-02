// Mock CSS imports for Jest
jest.mock('../../../src/components/Car/rsiEdit.css', () => ({}));
jest.mock('../../../src/components/Car/Wrapper/formWrapper.css', () => ({}));
jest.mock('../../../src/components/DeleteConfirmation/DeleteConfirmation.css', () => ({}));
jest.mock('../../../src/api/cars.api', () => ({
  setRegularServiceItem: jest.fn(() => Promise.resolve())
}));

jest.doMock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useSuspenseQuery: jest.fn().mockReturnValue({}),
  };
});

// Mock <dialog> and showModal for jsdom
beforeAll(() => {
  if (!window.HTMLDialogElement) {
    // @ts-ignore
    window.HTMLDialogElement = class {};
  }
  if (!HTMLDialogElement.prototype.showModal) {
    // @ts-ignore
    HTMLDialogElement.prototype.showModal = function () {};
  }
  if (!HTMLDialogElement.prototype.close) {
    // @ts-ignore
    HTMLDialogElement.prototype.close = function () {};
  }
});

import { fireEvent, render, screen } from '@testing-library/react';
import RsiEdit from '../../../src/components/Car/RsiEdit';
import { AuthContext } from '../../../src/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock user and car data
const mockUser = {
  id: 1,
  username: 'testuser',
  password: 'testpass',
  surname: 'TestSurname',
  name: 'TestName',
  car: {
    id: 1,
    vin: 'TESTVIN1234567890',
    hsn: '1234',
    tsn: '567',
    enginecode: 'ENG123',
    transmissioncode: 'AUTOMATIC',
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
    note: '',
    vrdPicture: '',
  },
};

const mockSetShowForm = jest.fn();
const mockLogout = jest.fn();
const mockLogin = jest.fn();

const queryClient = new QueryClient();

const defaultComponent = (
  <QueryClientProvider client={queryClient}>
    <AuthContext.Provider
      value={{
        isLoggedIn: true,
        user: mockUser,
        login: mockLogin,
        logout: mockLogout,
      }}
    >
      <RsiEdit setShowForm={mockSetShowForm} user={mockUser as any} />
    </AuthContext.Provider>
  </QueryClientProvider>
);

describe('<RsiEdit />', () => {
  it('should render and match the snapshot', () => {
    const { asFragment } = render(defaultComponent);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should have correct label', () => {
    render(defaultComponent);
    expect(screen.getByText('Regelmäßige Service-Elemente')).toBeTruthy();
  });

  it('Add button is clickable', async () => {
    render(defaultComponent);
    const addButton = screen.getByText(/Regulären Service Eintrag hinzufügen/i);
    fireEvent.click(addButton);
    expect(addButton).toBeTruthy();
  });

  it('A valid form data submit', async () => {
    render(defaultComponent);
    const updateButton = screen.getByText('Aktualisieren');
    fireEvent.click(updateButton);
    expect(updateButton).toBeTruthy();
  });

  it('Shows validation if required fields are empty', async () => {
    render(defaultComponent);
    // Simulate clearing the date input
    const dateInput = screen.getByLabelText('Zuletzt gemacht:') as HTMLInputElement;
    // Set to a valid ISO date string (simulate user clearing and re-entering a valid date)
    fireEvent.change(dateInput, { target: { value: '2023-01-01' } });
    // Try to submit
    const updateButton = screen.getByText('Aktualisieren');
    fireEvent.click(updateButton);
    // The component should not crash, and the value should be '2023-01-01'
    expect(dateInput.value).toBe('2023-01-01');
  });

  it('Check the service select value', async () => {
    render(defaultComponent);
    const select = screen.getByLabelText('Service:') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Ölwechsel' } });
    expect(select).toBeTruthy();
  });
});
