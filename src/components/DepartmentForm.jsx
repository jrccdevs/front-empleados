import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Grow,
} from '@mui/material';


const DepartmentForm = ({ initialData, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    jefe_departamento_id: '', // Usamos string vacío para el select inicial, será null en el backend
  });
  const [errors, setErrors] = useState({});
  const [empleados, setEmpleados] = useState([]); // Lista de empleados para el dropdown
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Cargar datos iniciales del departamento si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        // Asegúrate de que jefe_departamento_id sea un string para el <select> si es null
        jefe_departamento_id: initialData.jefe_departamento_id ? String(initialData.jefe_departamento_id) : '',
      });
    }
  }, [initialData]);

   // Cargar la lista de empleados para el dropdown al montar el componente
   useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingEmployees(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
          },
        };
        console.log('Token:', token); // Puedes quitar esto si ya no necesitas debug
  
        // CAMBIO: Añadir parámetro 'select=true'
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/empleados?select=true`,
          config
        );
  
        // Manejo flexible según la estructura del response
        setEmpleados(response.data.empleados || response.data);
      } catch (error) {
        console.error('Error al cargar la lista de empleados:', error);
        toast.error('Error al cargar la lista de empleados para asignar jefe.');
      } finally {
        setLoadingEmployees(false);
      }
    };
  
    fetchEmpleados();
  }, []);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Opcional: Limpiar el error de validación cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validaciones básicas del formulario
  const validate = () => {
    let newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del departamento es obligatorio.';
    }
    // Puedes añadir más validaciones aquí, por ejemplo para la descripción
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // Manejar el envío del formulario (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return; // Si la validación falla, no enviar el formulario
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      let response;
      // Ajustar jefe_departamento_id a null si el valor es un string vacío
      const dataToSend = {
        ...formData,
        jefe_departamento_id: formData.jefe_departamento_id === '' ? null : Number(formData.jefe_departamento_id),
      };

      if (initialData && initialData.id) {
        // Modo Edición (PUT)
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/departamentos/${initialData.id}`,
          dataToSend,
          config
        );
        toast.success('Departamento actualizado exitosamente!');
      } else {
        // Modo Creación (POST)
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/departamentos`, dataToSend, config);
        toast.success('Departamento creado exitosamente!');
      }

      // Llama a la función onSuccess pasada por props (ej. para redirigir)
      onSuccess(response.data);
      // Limpiar formulario después de una creación exitosa
      if (!initialData) {
        setFormData({ nombre: '', descripcion: '', jefe_departamento_id: '' });
      }
    } catch (error) {
      console.error('Error al guardar el departamento:', error);
      const errorMessage = error.response?.data?.message || 'Error desconocido al guardar el departamento.';
      toast.error(errorMessage);
    }
  };

  return (
    <Grow in timeout={500}>
    <Paper elevation={6} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 8, borderRadius: 3 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom fontWeight="bold">
        {initialData ? 'Editar Departamento' : 'Crear Nuevo Departamento'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mt: 2 }}>
        {/* Nombre */}
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          margin="normal"
          error={!!errors.nombre}
          helperText={errors.nombre}
        />

        {/* Descripción */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          margin="normal"
        />

        {/* Jefe de Departamento */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Jefe de Departamento</InputLabel>
          {loadingEmployees ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Select
              name="jefe_departamento_id"
              value={formData.jefe_departamento_id}
              label="Jefe de Departamento"
              onChange={handleChange}
            >
              <MenuItem value="">Seleccione un jefe (Opcional)</MenuItem>
              {empleados.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.nombre} {emp.apellido} ({emp.email})
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Botón */}
        <Box textAlign="center" mt={4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {initialData ? 'Actualizar' : 'Crear'} Departamento
          </Button>
        </Box>
      </Box>
    </Paper>
  </Grow>
  );
};

export default DepartmentForm;