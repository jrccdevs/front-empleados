import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // O AdapterDayjs/AdapterMoment
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// Si no quieres usar DatePicker de MUI y prefieres react-datepicker,
// puedes envolver el DatePicker de react-datepicker con TextField de MUI para un estilo consistente.
// Ejemplo: <TextField {...params} /> en custom input

const CustomDatePickerInput = React.forwardRef(({ value, onClick, label, error, helperText }, ref) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onClick={onClick}
    inputRef={ref}
    error={error}
    helperText={helperText}
    readOnly // Make it read-only so typing is not allowed
  />
));

const EmployeeFilters = ({ filters, onFilterChange, departments }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleDateChange = (date, name) => {
    onFilterChange({ [name]: date ? date.toISOString().split('T')[0] : '' }); // Formato YYYY-MM-DD
  };

  const handleClearFilters = () => {
    onFilterChange({
      nombre: '',
      apellido: '',
      email: '',
      puesto: '',
      estado: '',
      departamento_id: '',
      fecha_ingreso_desde: '',
      fecha_ingreso_hasta: '',
      page: 1,
    });
  };

  // Convertir string dates de filtros a objetos Date para DatePicker
  const fechaIngresoDesde = filters.fecha_ingreso_desde ? new Date(filters.fecha_ingreso_desde) : null;
  const fechaIngresoHasta = filters.fecha_ingreso_hasta ? new Date(filters.fecha_ingreso_hasta) : null;

  return (
    <Box sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Filtrar Empleados
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={filters.nombre}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Apellido"
            name="apellido"
            value={filters.apellido}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={filters.email}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Puesto"
            name="puesto"
            value={filters.puesto}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            select
            label="Estado"
            name="estado"
            value={filters.estado}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="licencia">Licencia</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            select
            label="Departamento"
            name="departamento_id"
            value={filters.departamento_id}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          >
            <MenuItem value="">Todos</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.nombre}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {/* Usando react-datepicker con un input customizado de MUI */}
          <DatePicker
            selected={fechaIngresoDesde}
            onChange={(date) => handleDateChange(date, 'fecha_ingreso_desde')}
            dateFormat="yyyy-MM-dd"
            placeholderText="Fecha Ingreso Desde"
            customInput={<CustomDatePickerInput label="Fecha Ingreso Desde" />}
            isClearable
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            selected={fechaIngresoHasta}
            onChange={(date) => handleDateChange(date, 'fecha_ingreso_hasta')}
            dateFormat="yyyy-MM-dd"
            placeholderText="Fecha Ingreso Hasta"
            customInput={<CustomDatePickerInput label="Fecha Ingreso Hasta" />}
            isClearable
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          sx={{ mr: 1 }}
        >
          Limpiar Filtros
        </Button>
        {/* Aquí podrías añadir un botón de "Aplicar Filtros" si quieres que no se apliquen al instante */}
      </Box>
    </Box>
  );
};

export default EmployeeFilters;