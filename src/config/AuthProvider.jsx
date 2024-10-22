import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/AxiosInstance';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Componente proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [userId, setUserId] = useState(null);
  const [fincaId, setFincaId] = useState(null); 
  const [nombre, setNombre] = useState(''); 
  const [apellido, setApellido] = useState(''); 
  const [email, setEmail] = useState(null); 
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
  const checkBackendStatus = async () => {
    try {
      const response = await axiosInstance.get('/'); // Ruta de salud del backend
      if (response.status === 200) {
        // console.log('Backend está disponible');
        return true;
      }
    } catch (error) {
      // console.error('Backend no está disponible:', error);
      return false;
    }
  };
  
  // Función para inicializar la autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      const backendReady = await checkBackendStatus(); // Verifica si el backend está listo
      if (!backendReady) {
        setLoading(false); // Si el backend no está disponible, termina la carga
        return;
      }
  
      // Continúa con el flujo de autenticación si el backend está disponible
      const token = localStorage.getItem('access_token');
      if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.sub) {
          setUserId(decodedToken.sub);
          setEmail(decodedToken.email || '');
          setNombre(decodedToken.nombre || '');
          setApellido(decodedToken.apellido || '');
  
          try {
            await fetchUserData(decodedToken.sub); // Llama al backend para obtener datos adicionales
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
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
      const roleResponse = await axiosInstance.get(`/user-roles/user/${userId}`);
    
      if (roleResponse.status === 200) {
        const { id: rol_id } = roleResponse.data;
        //const { rol_id } = roleResponse.data;
        //const { rol_id, finca_id } = roleResponse.data;
        //setFincaId(finca_id || null); 

        // 2. Obtener el rol y permisos utilizando el rol_id
        const roleDetailsResponse = await axiosInstance.get(`/roles/${rol_id}/permissions`);
         
        if (roleDetailsResponse.status === 200) {
          const { role, permissions } = roleDetailsResponse.data;
          setRole(role);
          setPermissions(permissions);
        } else {
          console.error('Error al obtener los detalles del rol:', roleDetailsResponse.status);
        }
      } else {
        console.error('Error al obtener el rol del usuario:', roleResponse.status);
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  // Función para manejar el login
  const login = async (token) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.sub) {
      setUserId(decodedToken.sub);
      setEmail(decodedToken.email || ''); 
      setNombre(decodedToken.nombre || ''); 
      setApellido(decodedToken.apellido || ''); 
      await fetchUserData(decodedToken.sub);
    }
  };

  // Función para manejar el logout
  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUserId(null);
    setFincaId(null);
    setEmail(null);
    setNombre('');
    setApellido('');
    setRole(null);
    setPermissions([]);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userId, 
      fincaId,
      nombre, 
      apellido, 
      email, 
      permissions, 
      role, 
      loading, 
      login,
      logout,
      
    }}>
      {children}
    </AuthContext.Provider>
  );
};
