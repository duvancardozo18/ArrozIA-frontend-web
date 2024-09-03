import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
