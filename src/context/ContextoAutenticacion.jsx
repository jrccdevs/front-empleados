// src/contexto/ContextoAutenticacion.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import clienteApi from '../api/clienteApi'; // Importa tu cliente Axios configurado
import { useNavigate } from 'react-router-dom';

// Crea el contexto de autenticación
const AuthContext = createContext(null);

// Crea el proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // Contendrá los datos del usuario logueado
  const [cargando, setCargando] = useState(true); // Para saber si estamos cargando la sesión inicial
  const navigate = useNavigate();

  // Efecto para verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const verificarAutenticacion = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Intenta obtener los datos del usuario o verificar el token
          // Si tienes un endpoint para obtener el usuario autenticado, úsalo.
          // Por ahora, asumimos que si hay un token, el usuario está "logueado" con su rol.
          // En una aplicación real, harías una llamada a /api/auth/me o similar.
          const userData = JSON.parse(localStorage.getItem('usuarioData')) || { rol: 'empleado' }; // Obtener rol de datos guardados
          setUsuario(userData);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('usuarioData');
          setUsuario(null);
        }
      }
      setCargando(false);
    };
    verificarAutenticacion();
  }, []);

  // Función para iniciar sesión
  const iniciarSesion = async (email, contrasena) => {
    try {
      const response = await clienteApi.post('/auth/login', { email, contrasena });
      const { token, usuario: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuarioData', JSON.stringify(userData)); // Guardar datos del usuario
      setUsuario(userData);
      navigate('/dashboard'); // Redirigir al dashboard
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
      setUsuario(null);
      // Puedes lanzar el error para que el componente de login lo maneje
      throw error;
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioData');
    setUsuario(null);
    navigate('/login'); // Redirigir a la página de login
  };

  // Función para verificar roles
  const tieneRol = (rolesPermitidos) => {
    if (!usuario) return false;
    if (Array.isArray(rolesPermitidos)) {
      return rolesPermitidos.includes(usuario.rol);
    }
    return usuario.rol === rolesPermitidos;
  };

  const valorContexto = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    tieneRol,
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {cargando ? <div>Cargando sesión...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};