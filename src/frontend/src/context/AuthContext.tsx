import React, { createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { User } from '../types/user';

interface AuthContextProps {
    isLoggedIn: boolean;
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('user'));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setIsLoggedIn(!!Cookies.get('user'));
        const userCookie = Cookies.get('user');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
    }, []);

    const login = (user: User) => {
        setIsLoggedIn(true);
        setUser(user);
        Cookies.set('user', JSON.stringify(user));
    };

    const logout = () => {
        setIsLoggedIn(false);
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
    };

    const contextValue = useMemo(() => ({
        isLoggedIn,
        user,
        login,
        logout,
    }), [isLoggedIn, user]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export function getUserFromCookie(): User | null {
    const userCookie = Cookies.get('user');
    if (userCookie) {
        return JSON.parse(userCookie);
    }
    return null;
}