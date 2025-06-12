import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployeeDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/empleados/${id}`, config);
      setEmployee(response.data);
    } catch (err) {
      console.error('Error al cargar detalles del empleado:', err);
      setError(err);
      toast.error('Error al cargar los detalles del empleado.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando detalles del empleado...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h6" color="error" align="center">
          Error: {error.message}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/empleados')}>
            Volver a la Lista
          </Button>
        </Box>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h6" align="center">
          Empleado no encontrado.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/empleados')}>
            Volver a la Lista
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Detalles del Empleado
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Nombre:</Typography>
            <Typography variant="body1">{employee.nombre}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Apellido:</Typography>
            <Typography variant="body1">{employee.apellido}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Email:</Typography>
            <Typography variant="body1">{employee.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Teléfono:</Typography>
            <Typography variant="body1">{employee.telefono || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Fecha de Ingreso:</Typography>
            <Typography variant="body1">
              {employee.fecha_ingreso ? new Date(employee.fecha_ingreso).toLocaleDateString() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Puesto:</Typography>
            <Typography variant="body1">{employee.puesto || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Estado:</Typography>
            <Typography variant="body1">{employee.estado}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Departamento:</Typography>
            <Typography variant="body1">
              {employee.departamento ? employee.departamento.nombre : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">Supervisor:</Typography>
            <Typography variant="body1">
              {employee.supervisor ? `${employee.supervisor.nombre} ${employee.supervisor.apellido}` : 'N/A'}
            </Typography>
          </Grid>
          {/* Agrega más campos según tu modelo de empleado */}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/empleados')}
            sx={{ mr: 2 }}
          >
            Volver a la Lista
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/empleados/editar/${employee.id}`)}
          >
            Editar Empleado
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeDetailPage;