import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://3.17.27.249:8000', // Usa la variable de entorno
  // baseURL: import.meta.env.VITE_API_BASE_URL, // Usa la variable de entorno
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Obtén el token del localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Agrega el token al encabezado de Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response, // Retorna la respuesta si no hay errores
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si hay un error 401 (no autorizado), redirigir al login
      localStorage.removeItem('access_token'); // Eliminar el token expirado
      window.location.href = '/'; // Redirigir al login
    }
    return Promise.reject(error); // Retornar el error para manejarlo localmente si es necesario
  }
);

export default axiosInstance;
