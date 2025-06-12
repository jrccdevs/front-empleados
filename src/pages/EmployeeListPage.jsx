import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Pagination, // Usaremos el Pagination de MUI
} from '@mui/material';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFilters from '../components/EmployeeFilters';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    nombre: '',
    apellido: '',
    email: '',
    puesto: '',
    estado: '',
    departamento_id: '',
    fecha_ingreso_desde: '',
    fecha_ingreso_hasta: '',
    page: 1,
    limit: 10,
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/empleados`, config);
      setEmployees(response.data.empleados);
      setTotalEmployees(response.data.total);
      setTotalPages(response.data.total_paginas);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setError(err);
      toast.error('Error al cargar la lista de empleados.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDepartments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departamentos?select=true`, config);
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Error al cargar departamentos para filtros:', err);
      toast.error('Error al cargar departamentos para filtros.');
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (event, newPage) => { // MUI Pagination pasa event y page
    setFilters(prevFilters => ({
      ...prevFilters,
      page: newPage,
    }));
  };

  const handleViewDetails = (id) => {
    navigate(`/empleados/${id}`);
  };

  const handleEditEmployee = (id) => {
    navigate(`/empleados/editar/${id}`);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este empleado?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/empleados/${id}`, config);
        toast.success('Empleado eliminado exitosamente.');
        fetchEmployees();
      } catch (err) {
        console.error('Error al eliminar empleado:', err);
        toast.error('Error al eliminar empleado.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Lista de Empleados
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/empleados/nuevo')}
        sx={{ mb: 3 }}
      >
        Crear Nuevo Empleado
      </Button>

      <EmployeeFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        departments={departments}
      />

      {loading && employees.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Cargando empleados...</Typography>
        </Box>
      ) : error && employees.length === 0 ? (
        <Typography variant="body1" color="error" sx={{ mt: 4, textAlign: 'center' }}>
          Error: {error.message}
        </Typography>
      ) : (
        <>
          <EmployeeTable
            employees={employees}
            onViewDetails={handleViewDetails}
            onEditEmployee={handleEditEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={filters.page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default EmployeeListPage;