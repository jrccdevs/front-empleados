// src/api/clienteApi.js
import axios from 'axios';

// Obtener la URL base de la API desde las variables de entorno de Vite
// Vite usa import.meta.env y las variables deben empezar con VITE_
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; // Ajusta el puerto si tu backend no usa el 3000

const clienteApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las solicitudes (si existe)
clienteApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Asumimos que guardamos el token en localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default clienteApi;