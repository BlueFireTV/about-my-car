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
            const errorMessage = response.status === 200
                ? 'Login Erfolgreich!'
                : response.status === 401
                    ? 'Nutzername oder Kennwort ist falsch!'
                    : response.status === 500
                        ? 'Fehler! Versuche es später erneut!'
                        : 'Unbekannter Fehler!';
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
                    <label>Nutzername:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username eingeben"
                    />
                </div>
                <div className="formGroup">
                    <label>Passwort:</label>
                    <input
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