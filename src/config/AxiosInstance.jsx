import axios from 'axios';

// Configura la instancia de Axios con la base URL desde el archivo de entorno de Vite
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Asegúrate de que VITE_API_BASE_URL esté definida en tu archivo .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtén el token de autenticación del localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      // Agrega el token al encabezado de autorización
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Maneja errores de configuración de solicitud
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de respuesta globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    // Retorna la respuesta directamente si es exitosa
    return response;
  },
  (error) => {
    // Verifica si el error es de autenticación (401)
    if (error.response && error.response.status === 401) {
      // Elimina el token de localStorage y redirige al login
      localStorage.removeItem('access_token');
      window.location.href = '/'; // Ajusta esta ruta si el login está en otra ubicación
    }
    // Retorna el error para manejarlo localmente si es necesario
    return Promise.reject(error);
  }
);

export default axiosInstance;
