// src/paginas/ListaDepartamentosPagina.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import clienteApi from '../api/clienteApi';
import { useAuth } from '../context/ContextoAutenticacion';

function ListaDepartamentosPagina() {
  const [departamentos, setDepartamentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { tieneRol, cerrarSesion } = useAuth(); // Agregamos cerrarSesion para manejar el 401

  useEffect(() => {
    const obtenerDepartamentos = async () => {
      try {
        const response = await clienteApi.get('/departamentos');
        setDepartamentos(response.data);
      } catch (err) {
        console.error("Error al obtener departamentos:", err); // <-- Mantén este log

        // --- INICIO: Lógica de manejo de error más detallada ---
        if (err.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error("Respuesta de error del servidor:", err.response.data);
          console.error("Estado del error:", err.response.status);
          console.error("Headers del error:", err.response.headers);

          if (err.response.status === 401) {
            setError('Su sesión ha expirado o no tiene autorización. Por favor, inicie sesión de nuevo.');
            cerrarSesion(); // Cierra la sesión si el token es inválido/expirado
            navigate('/login'); // Redirige al login
          } else if (err.response.status === 500) {
            setError('Error interno del servidor al cargar departamentos. Intente de nuevo más tarde.');
          } else {
            setError(`Error del servidor (${err.response.status}): ${err.response.data.message || 'Desconocido'}`);
          }
        } else if (err.request) {
          // La solicitud fue hecha pero no se recibió respuesta (ej. red caída, CORS mal configurado)
          console.error("No se recibió respuesta del servidor:", err.request);
          setError('No se pudo conectar con el servidor. Verifique su conexión a internet o intente más tarde.');
        } else {
          // Algo más ocurrió al configurar la solicitud
          console.error("Error de configuración de la solicitud:", err.message);
          setError(`Error al configurar la solicitud: ${err.message}`);
        }
        // --- FIN: Lógica de manejo de error más detallada ---

      } finally {
        setCargando(false);
      }
    };

    obtenerDepartamentos();
  }, [navigate, cerrarSesion]); // Añade navigate y cerrarSesion a las dependencias si se usan en el efecto

  // ... (el resto del código de tu componente ListaDepartamentosPagina.jsx permanece igual)
  // ... (handleVerDetalle, handleEditar, handleEliminar, etc.)
  // ... (renderizado de cargando, error, tabla, etc.)
  const handleVerDetalle = (id) => {
    navigate(`/departamentos/${id}`); // Navegar a la página de detalle
  };

  const handleEditar = (id) => {
    navigate(`/departamentos/editar/${id}`); // Navegar a la página de edición (la crearemos luego)
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
      try {
        await clienteApi.delete(`/departamentos/${id}`);
        setDepartamentos(departamentos.filter(dep => dep.id !== id));
        alert('Departamento eliminado exitosamente.'); // Idealmente usar una notificación MUI (Día 4)
      } catch (err) {
        console.error("Error al eliminar departamento:", err);
        setError('Error al eliminar el departamento. Verifique si tiene empleados asociados.');
      }
    }
  };

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando departamentos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Departamentos
      </Typography>
      {tieneRol('admin') && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
          onClick={() => navigate('/departamentos/crear')}
        >
          Crear Nuevo Departamento
        </Button>
      )}

      {departamentos.length === 0 ? (
        <Alert severity="info">No hay departamentos registrados.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Jefe de Departamento</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departamentos.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell>{dep.id}</TableCell>
                  <TableCell>{dep.nombre}</TableCell>
                  <TableCell>{dep.descripcion}</TableCell>
                  <TableCell>{dep.jefe ? `${dep.jefe.nombre} ${dep.jefe.apellido}` : 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => handleVerDetalle(dep.id)}
                    >
                      Ver
                    </Button>
                    {tieneRol('admin') && (
                      <>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => handleEditar(dep.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleEliminar(dep.id)}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ListaDepartamentosPagina;