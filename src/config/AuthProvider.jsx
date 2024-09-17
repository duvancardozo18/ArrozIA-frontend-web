import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/AxiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [userId, setUserId] = useState(null);
  const [nombre, setNombre] = useState(''); // Estado para nombre
  const [apellido, setApellido] = useState(''); // Estado para apellido
  const [email, setEmail] = useState(null); // Estado para el email
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Función para decodificar el JWT
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

  // Función para inicializar la autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub);
          setEmail(decodedToken.email || ''); // Asigna el email si está presente en el token
          setNombre(decodedToken.nombre || ''); // Asigna el nombre si está presente en el token
          setApellido(decodedToken.apellido || ''); // Asigna el apellido si está presente en el token
  
          try {
            await fetchUserData(decodedToken.sub); // Llama al backend para obtener datos adicionales si es necesario
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAuthenticated(false);
          }
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
  



  // Función para obtener datos del usuario desde el backend
  const fetchUserData = async (userId) => {
    try {
      const response = await axiosInstance.get(`/roles/${userId}/permissions`);
      if (response.status === 200) {
        const { role, permissions, email, nombre, apellido } = response.data; 
        setRole(role);
        setPermissions(permissions);
        setEmail(email || ''); // Asigna email, si no está disponible, usa vacío
        setNombre(nombre || ''); // Asigna nombre, si no está disponible, usa vacío
        setApellido(apellido || ''); // Asigna apellido, si no está disponible, usa vacío
      } else {
        console.error('Error fetching user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Función para login
  const login = (token) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.sub) {
      setUserId(decodedToken.sub);
      setEmail(decodedToken.email || ''); // Asigna el email si está presente
      fetchUserData(decodedToken.sub);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userId, 
      nombre, 
      apellido, 
      email, 
      permissions, 
      role, 
      loading, 
      login 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
