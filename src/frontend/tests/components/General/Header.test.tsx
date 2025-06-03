
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../../src/components/General/Header';
import { AuthContext } from '../../../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

// CSS-Import für Header mocken
jest.mock('../../../src/components/General/Header.css', () => ({}), { virtual: true });

jest.mock('react-router-dom', () => {
  return {
    Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>,
    useNavigate: () => () => {},
    useLocation: () => ({ pathname: '/' }), // <-- Mock für useLocation
    MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Link: ({ to, children, ...rest }: any) => <a href={to} {...rest}>{children}</a>, // optional
  };
});

describe('Header', () => {
  const mockLogout = jest.fn();
  const mockUser = {
    id: 1,
    username: 'testuser',
    password: '',
    surname: 'Tester',
    name: 'Max',
    car: {} as any,
  };

  function renderHeader(contextValue: any) {
    render(
      <AuthContext.Provider value={contextValue}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }

  it('zeigt Login-Button, wenn nicht eingeloggt', () => {
    renderHeader({ isLoggedIn: false });

    expect(screen.getByText(/login/i)).not.toBeNull();
    expect(screen.queryByText(/ausloggen/i)).toBeNull();
    expect(screen.queryByText(/Auto/)).toBeNull();
  });

  it('zeigt Auto-Link und User-Button, wenn eingeloggt', () => {
    renderHeader({ isLoggedIn: true, logout: mockLogout, user: mockUser });

    expect(screen.getByText(/auto/i)).not.toBeNull();
    expect(screen.queryByText(/login/i)).toBeNull();
    expect(screen.getByText(/mt/i)).not.toBeNull(); // Initialen
  });

  it('öffnet und schließt User-Popup', () => {
    renderHeader({ isLoggedIn: true, logout: mockLogout, user: mockUser });

    // Popup nicht sichtbar
    expect(screen.queryByText(/ausloggen/i)).toBeNull();

    // Klicke auf das Initialen-Icon
    fireEvent.click(screen.getByText(/mt/i));
    expect(screen.getByText(/ausloggen/i)).not.toBeNull();

    // Klicke auf das "X" zum Schließen
    fireEvent.click(screen.getByRole('button', { name: '' })); // Erster Button im Popup ist das X
    expect(screen.queryByText(/ausloggen/i)).toBeNull();
  });

  it('ruft Logout, wenn Ausloggen geklickt wird', () => {
    renderHeader({ isLoggedIn: true, logout: mockLogout, user: mockUser });

    // Popup öffnen
    fireEvent.click(screen.getByText(/mt/i));

    // Klick auf Ausloggen
    fireEvent.click(screen.getByText(/ausloggen/i));
    expect(mockLogout).toHaveBeenCalled();
  });
});