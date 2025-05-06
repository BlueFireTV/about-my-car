import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Menu, UserRoundCog, X } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [showPopup, setShowPopup] = useState(false);
    const [menuActive, setMenuActive] = useState(false);

    // Get current location
    const location = useLocation();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setMenuActive(false);
            setShowPopup(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    return (
        <header className="header">
            <Menu className="menu-toggle" onClick={() => setMenuActive(!menuActive)} />
            <Link to="/">
                <img src="/icons/logo.png" alt="Logo" className="logo" />
            </Link>

            <nav className={`nav ${menuActive ? 'active' : ''}`}>
                <div className="popup-header">
                    <img src="/icons/logo.png" alt="Logo" className="popup-header-logo" />
                    <X className="close-popup-header" onClick={() => setMenuActive(false)} />
                </div>
                <ul className="nav-list">
                    <li>
                        <button>
                            <Link
                                to="/"
                                className={
                                    location.pathname === '/' ? 'active-link' : ''
                                }
                            >
                                Home
                            </Link>
                        </button>
                    </li>
                    {authContext?.isLoggedIn && (
                            <li>
                                <button>
                                    <Link
                                        to="/car"
                                        className={
                                            location.pathname === '/car' ? 'active-link' : ''
                                        }
                                    >
                                        Auto
                                    </Link>
                                </button>
                            </li>
                        )}
                </ul>
            </nav>

            {!authContext?.isLoggedIn && (
                <button className='login-button'>
                    <Link className='login-link' to="/login">
                        Login
                    </Link>
                </button>
            )}

            {authContext?.isLoggedIn && (
                <>
                    <button
                        className="user-header-status-button"
                        onClick={() => setShowPopup(!showPopup)}
                    >
                        <div className="user-header-group">
                            <span>
                                {authContext.user?.name.charAt(0).toUpperCase()}
                                {authContext.user?.surname.charAt(0).toUpperCase()}
                            </span>
                            <UserRoundCog className='user-header-usericon ' />
                        </div>
                    </button>
                    {showPopup && (
                        <div className="user-header-popup">
                            <div className="user-header-popup-close-line">
                                <button className="user-header-popup-close" onClick={() => setShowPopup(false)}>
                                    <X />
                                </button>
                            </div>
                            <button onClick={authContext.logout}>
                                Ausloggen
                            </button>
                        </div>
                    )}
                </>
            )}
        </header>
    );
};

export default Header;
