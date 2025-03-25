import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
    element: React.JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const authContext = useContext(AuthContext);

    return authContext?.isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;