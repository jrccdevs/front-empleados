import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, CircularProgress, Typography, Box } from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [errorLoadingInitialData, setErrorLoadingInitialData] = useState(null);

  const isEditMode = !!id;

  const fetchEmployee = useCallback(async () => {
    if (!isEditMode) {
      setLoadingInitialData(false);
      return;
    }
    setLoadingInitialData(true);
    setErrorLoadingInitialData(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/empleados/${id}`, config);
      setEmployeeData(response.data);
    } catch (err) {
      console.error('Error al cargar datos iniciales del empleado:', err);
      setErrorLoadingInitialData(err);
      toast.error('Error al cargar datos del empleado para edición.');
    } finally {
      setLoadingInitialData(false);
    }
  }, [id, isEditMode]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/empleados/${id}`, formData, config);
        toast.success('Empleado actualizado exitosamente.');
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/empleados`, formData, config);
        toast.success('Empleado creado exitosamente.');
      }
      navigate('/empleados');
    } catch (err) {
      console.error('Error al guardar empleado:', err);
      toast.error(`Error al guardar empleado: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  if (isEditMode && loadingInitialData) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando datos del empleado para edición...</Typography>
      </Container>
    );
  }

  if (isEditMode && errorLoadingInitialData) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h6" color="error" align="center">
          Error: {errorLoadingInitialData.message}
        </Typography>
      </Container>
    );
  }

  if (isEditMode && !employeeData && !loadingInitialData) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h6" align="center">
          Empleado no encontrado para editar.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <EmployeeForm
        onSubmit={handleSubmit}
        initialData={employeeData || {}}
      />
    </Container>
  );
};

export default EmployeeFormPage;