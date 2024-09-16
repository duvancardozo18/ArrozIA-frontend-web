import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/AxiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [userId, setUserId] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub);
          await fetchUserData(decodedToken.sub);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); 
    };

    initializeAuth();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axiosInstance.get(`/roles/${userId}/permissions`);
      if (response.status === 200) {
        const { role, permissions } = response.data; 
        setRole(role);
        setPermissions(permissions);
      } else {
        console.error('Error fetching user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.sub) {
      setUserId(decodedToken.sub);
      fetchUserData(decodedToken.sub);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, permissions, role, loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};
