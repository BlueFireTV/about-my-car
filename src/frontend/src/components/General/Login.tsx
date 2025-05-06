import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../context/AuthContext';
import {handleLogin} from "../../api/users.api.ts";

import "./Login.css"
import { User } from '../../types/user.ts';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        // Selektiere den Container und füge die expand-Klasse hinzu
        const container = document.querySelector('.loginContainer');
        if (container) {
            container.classList.add('expand');
        }
    
        // Nach 1 Sekunde weiterleiten
        const response = await handleLogin(username.toLowerCase(), password);

        if (!response.ok) {
            let errorMessage: string;
            if (response.status === 200) {
                errorMessage = 'Login Erfolgreich!';
            } else if (response.status === 401) {
                errorMessage = 'Nutzername oder Kennwort ist falsch!';
            } else if (response.status === 500) {
                errorMessage = 'Fehler! Versuche es später erneut!';
            } else {
                errorMessage = 'Unbekannter Fehler!';
            }
            setMessage(errorMessage);
            container?.classList.remove('expand'); // Rückgängig machen, falls Login fehlschlägt
            return;
        }

        const data = await response.json();
        Cookies.set('token', data.token);
        authContext?.login(jwtDecode<User>(data.token));
        navigate('/'); 
    };     

    const loginForm = 
        <div className="loginContainer">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="loginForm">
                <div className="formGroup">
                    <label htmlFor="username">Nutzername:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username eingeben"
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="password">Passwort:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Passwort eingeben"
                    />
                </div>
                <button type="submit" className="loginButton">Login</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>;

    return authContext?.isLoggedIn ? <Navigate to="/" /> : loginForm;
};

export default Login;