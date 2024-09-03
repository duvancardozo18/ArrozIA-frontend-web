import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Aquí podrías agregar lógica para verificar la validez del token si es necesario
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  const login = (token) => {
    localStorage.setItem('access_token', token); // Guarda el token en localStorage
    console.log("Guardando token:", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token'); // Elimina el token de localStorage
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
