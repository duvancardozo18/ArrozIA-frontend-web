import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/AxiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [userId, setUserId] = useState(null);
  const [permissions, setPermissions] = useState([]);

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
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.sub) {
        setUserId(decodedToken.sub);
        fetchPermissions(decodedToken.sub);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchPermissions = async (userId) => {
    try {
      const viewResponse = await axiosInstance.get(`/view-secure-data?user_id=${userId}`);
      const editResponse = await axiosInstance.get(`/edit-secure-data?user_id=${userId}`);

      const perms = [];
      if (viewResponse.status === 200) perms.push("view_secure_data");
      if (editResponse.status === 200) perms.push("edit_secure_data");

      setPermissions(perms);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const login = (token) => {
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.sub) {
      setUserId(decodedToken.sub);
      fetchPermissions(decodedToken.sub);
      localStorage.setItem('access_token', token);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUserId(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};
