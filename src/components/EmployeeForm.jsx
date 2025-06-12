// frontend/src/components/EmployeeForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Typography,
  Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePickerInput = React.forwardRef(({ value, onClick, label, error, helperText }, ref) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onClick={onClick}
    inputRef={ref}
    error={error}
    helperText={helperText}
    variant="outlined"
    size="small"
    readOnly
  />
));

const EmployeeForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_ingreso: null,
    puesto: '',
    estado: 'activo',
    departamento_id: '',
    supervisor_id: '',
  });
  const [errors, setErrors] = useState({});
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos iniciales si estamos en modo edición
  useEffect(() => {
    // Check if initialData has an 'id' and is not just an empty object or null
    if (initialData && initialData.id) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
        fecha_ingreso: initialData.fecha_ingreso ? new Date(initialData.fecha_ingreso) : null,
        puesto: initialData.puesto || '',
        estado: initialData.estado || 'activo',
        departamento_id: initialData.departamento_id || '',
        supervisor_id: initialData.supervisor_id || '',
      });
    } else {
        // Reset form data if in create mode or initialData is not valid for editing
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            fecha_ingreso: null,
            puesto: '',
            estado: 'activo',
            departamento_id: '',
            supervisor_id: '',
        });
    }
  }, [initialData]);

  // Cargar lista de departamentos
  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departamentos?select=true`, config);
      setDepartments(response.data);
    } catch (err) {
      console.error('Error al cargar departamentos:', err);
      toast.error('Error al cargar departamentos para el formulario.');
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  // Cargar lista de empleados para seleccionar supervisor
  const fetchSupervisors = useCallback(async () => {
    setLoadingSupervisors(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/empleados?select=true`, config);
      setSupervisors(response.data);
    } catch (err) {
      console.error('Error al cargar supervisores:', err);
      toast.error('Error al cargar la lista de supervisores.');
    } finally {
      setLoadingSupervisors(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchSupervisors();
  }, [fetchDepartments, fetchSupervisors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, fecha_ingreso: date });
    setErrors({ ...errors, fecha_ingreso: undefined });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.apellido) newErrors.apellido = 'El apellido es obligatorio.';
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido.';
    }
    if (!formData.telefono) newErrors.telefono = 'El teléfono es obligatorio.';
    if (!formData.fecha_ingreso) newErrors.fecha_ingreso = 'La fecha de ingreso es obligatoria.';
    if (!formData.puesto) newErrors.puesto = 'El puesto es obligatorio.';
    if (!formData.departamento_id) newErrors.departamento_id = 'El departamento es obligatorio.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      toast.error('Por favor, corrige los errores del formulario.');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso ? formData.fecha_ingreso.toISOString().split('T')[0] : null,
        departamento_id: formData.departamento_id === '' ? null : formData.departamento_id,
        supervisor_id: formData.supervisor_id === '' ? null : formData.supervisor_id,
      };

      await onSubmit(dataToSend);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error al enviar formulario de empleado:', err);
      toast.error(`Error al ${initialData.id ? 'actualizar' : 'crear'} empleado: ${err.response?.data?.message || err.message}`);
      setIsSubmitting(false);
    }
  };

  // Define a safe variable to hold the ID of the current employee (if any)
  // This ensures that `employeeIdToExclude` is always a safe value (either the ID or undefined)
  // before being used in the filter.
  const employeeIdToExclude = initialData && initialData.id ? initialData.id : undefined;


  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
        {initialData.id ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            error={!!errors.apellido}
            helperText={errors.apellido}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            error={!!errors.telefono}
            helperText={errors.telefono}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            selected={formData.fecha_ingreso}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona una fecha"
            customInput={<CustomDatePickerInput
              label="Fecha de Ingreso"
              error={!!errors.fecha_ingreso}
              helperText={errors.fecha_ingreso}
            />}
            isClearable
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Puesto"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            error={!!errors.puesto}
            helperText={errors.puesto}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            variant="outlined"
            size="small"
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="licencia">Licencia</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Departamento"
            name="departamento_id"
            value={formData.departamento_id}
            onChange={handleChange}
            error={!!errors.departamento_id}
            helperText={errors.departamento_id}
            variant="outlined"
            size="small"
            disabled={loadingDepartments}
          >
            <MenuItem value="">{loadingDepartments ? 'Cargando departamentos...' : 'Selecciona un departamento'}</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Supervisor (Opcional)"
            name="supervisor_id"
            value={formData.supervisor_id}
            onChange={handleChange}
            variant="outlined"
            size="small"
            disabled={loadingSupervisors}
          >
            <MenuItem value="">{loadingSupervisors ? 'Cargando supervisores...' : 'Selecciona un supervisor'}</MenuItem>
            {/* THIS IS THE CRITICAL LINE (formerly 166 or 183) */}
            {supervisors
               .filter(sup => sup.id !== employeeIdToExclude) // <--- USE THE SAFE VARIABLE HERE
               .map((sup) => (
              <MenuItem key={sup.id} value={sup.id}>{sup.nombre} {sup.apellido} ({sup.email})</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? (initialData.id ? 'Actualizando...' : 'Creando...') : (initialData.id ? 'Actualizar Empleado' : 'Crear Empleado')}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeForm;