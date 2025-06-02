jest.mock('../../../src/components/General/Login.css', () => ({}));

jest.mock('react-router-dom', () => {
  return {
    Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>,
    useNavigate: () => () => {},
    MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../../src/components/General/Login';
import { AuthContext } from '../../../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// Mock handleLogin
jest.mock('../../../src/api/users.api', () => ({
  handleLogin: jest.fn(),
}));

import { handleLogin } from '../../../src/api/users.api';

// Mock jwt-decode
const mockDecoded = { username: 'testuser' };
jest.mock('jwt-decode', () => ({
  __esModule: true,
  default: () => mockDecoded,
  jwtDecode: () => mockDecoded, // Add named export for jwtDecode
}));

const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockUser = {
  id: 1,
  username: 'testuser',
  password: 'irrelevant',
  surname: 'Mustermann',
  name: 'Max',
  car: {} as any,
};
const renderLogin = (isLoggedIn = false) =>
  render(
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login: mockLogin,
        logout: mockLogout,
        user: mockUser,
      }}
    >
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    renderLogin();
    // Use a more specific query for the heading
    expect(screen.getByRole('heading', { name: /login/i })).not.toBeNull();
    expect(screen.getByLabelText(/nutzername/i)).not.toBeNull();
    expect(screen.getByLabelText(/passwort/i)).not.toBeNull();
  });

  it('shows error on failed login', async () => {
    (handleLogin as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: jest.fn(),
    });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/nutzername/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/passwort/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/nutzername oder kennwort ist falsch!/i)).not.toBeNull();
    });
  });

  it('logs in and redirects on successful login', async () => {
    const fakeToken = 'fake.jwt.token';

    (handleLogin as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ token: fakeToken }),
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/nutzername/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/passwort/i), { target: { value: 'rightpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockDecoded);
    });
  });

  it('redirects if already logged in', () => {
    renderLogin(true);
    expect(screen.queryByText(/login/i)).toBeNull();
  });
});