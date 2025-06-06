import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const usertoken  = JSON.parse(localStorage.getItem('usertoken'));

  return usertoken  ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
