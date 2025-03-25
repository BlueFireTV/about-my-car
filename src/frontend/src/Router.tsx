import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/General/Login';
import Car from './components/Car/Car';
import PrivateRoute from './components/PrivateRoute';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/car',
    element: <PrivateRoute element={<Car />} />,
  }

]);

export default router;
