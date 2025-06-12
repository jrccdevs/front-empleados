// src/paginas/DetalleDepartamentoPagina.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Divider,
  Container // <-- AÑADIDO: Importar Container
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import clienteApi from '../api/clienteApi'; // Asegúrate de que la ruta sea correcta
import { toast } from 'react-toastify'; // <-- AÑADIDO: Importar toast

function DetalleDepartamentoPagina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departamento, setDepartamento] = useState(null);
  const [cargando, setCargando] = useState(true); // Usando 'cargando' consistentemente
  const [error, setError] = useState(null);

  const obtenerDetalleDepartamento = useCallback(async () => {
    setCargando(true); // Usando setCargando
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Usar clienteApi.get en lugar de axios.get directamente
      // Asegúrate de que clienteApi ya tiene configurado import.meta.env.VITE_API_BASE_URL
      const response = await clienteApi.get(`/departamentos/${id}`, config);
      setDepartamento(response.data);
    } catch (err) {
      console.error('Error al cargar detalles del departamento:', err); // <-- CORREGIDO: Mensaje de error
      // Mejor manejo del mensaje de error para el usuario
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al cargar los detalles del departamento.';
      setError(errorMessage);
      toast.error(errorMessage); // Mostrar el mensaje de error al usuario
    } finally {
      setCargando(false); // Usando setCargando
    }
  }, [id]); // Dependencias: id (de useParams)

  useEffect(() => {
    obtenerDetalleDepartamento();
  }, [obtenerDetalleDepartamento]); // Dependencia: la función memoizada

  // --- Renderizado Condicional ---

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando detalles del departamento...</Typography>
      </Box>
    );
  }

  // Si hay un error, mostrar la alerta
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}> {/* Centrar el contenido de error */}
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate('/departamentos')}
        >
          Volver a la Lista de Departamentos
        </Button>
      </Box>
    );
  }

  // Si no hay departamento y no hay error (ej. ID inválido o eliminado justo antes)
  if (!departamento) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}> {/* Centrar el contenido */}
        <Alert severity="info">Departamento no disponible o no encontrado.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate('/departamentos')}
        >
          Volver a la Lista de Departamentos
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, p: 3 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        onClick={() => navigate('/departamentos')}
      >
        Volver a la Lista de Departamentos
      </Button>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Detalle del Departamento: <Box component="span" sx={{ fontWeight: 'bold' }}>{departamento.nombre}</Box>
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Información Básica
          </Typography>
          <Typography variant="body1">
            <strong>ID:</strong> {departamento.id}
          </Typography>
          <Typography variant="body1">
            <strong>Descripción:</strong> {departamento.descripcion || 'N/A'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Jefe de Departamento
          </Typography>
          {/* Asegúrate de que tu backend envía 'jefe' como un objeto anidado si el departamento tiene un jefe */}
          {departamento.jefe ? (
            <>
              <Typography variant="body1">
                <strong>Nombre:</strong> {departamento.jefe.nombre || ''} {departamento.jefe.apellido || ''}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {departamento.jefe.email || 'N/A'}
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate(`/empleados/${departamento.jefe.id}`)}
                sx={{ mt: 1 }}
              >
                Ver Perfil del Jefe
              </Button>
            </>
          ) : (
            <Typography variant="body1">
              No hay un jefe de departamento asignado.
            </Typography>
          )}
        </Box>

        {/* Podrías añadir una sección para listar empleados del departamento si tu API lo proporciona */}
        {/*
        {departamento.empleados && departamento.empleados.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                Empleados del Departamento
              </Typography>
              <List>
                {departamento.empleados.map(emp => (
                  <ListItem key={emp.id} disablePadding>
                    <ListItemText primary={`${emp.nombre} ${emp.apellido} (${emp.puesto})`} />
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate(`/empleados/${emp.id}`)}
                    >
                      Ver Perfil
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
        */}

      </Paper>
    </Container>
  );
}

export default DetalleDepartamentoPagina;