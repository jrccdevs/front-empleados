// frontend/src/pages/HierarchyPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

// Componente para representar un nodo en la jerarquía
const HierarchyNode = ({ employee }) => {
  const StyledNode = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.grey[50],
    boxShadow: theme.shadows[1],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  }));

  const ChildrenContainer = styled(Box)(({ theme }) => ({
    marginLeft: theme.spacing(3), // Indent children
    borderLeft: `1px dashed ${theme.palette.divider}`,
    paddingLeft: theme.spacing(2),
  }));

  return (
    <Box sx={{ mb: employee.reportes_directos && employee.reportes_directos.length > 0 ? 2 : 0 }}>
      <StyledNode elevation={1}>
        {/* Usar el operador OR (|| '') para asegurar que siempre haya una cadena,
            incluso si la propiedad es null o undefined. */}
        <Typography variant="subtitle1" component="h3" color="primary.dark">
          {employee.nombre || ''} {employee.apellido || ''} {/* APLICA EL CAMBIO AQUÍ */}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Puesto: {employee.puesto || 'N/A'} {/* APLICA EL CAMBIO AQUÍ */}
        </Typography>
        {employee.email && (
          <Typography variant="body2" color="text.secondary">
            Email: {employee.email || 'N/A'} {/* APLICA EL CAMBIO AQUÍ */}
          </Typography>
        )}
      </StyledNode>

      {/* Render children recursively if they exist */}
      {employee.reportes_directos && employee.reportes_directos.length > 0 && (
        <ChildrenContainer>
          {employee.reportes_directos.map((reporte) => (
            <HierarchyNode key={reporte.id} employee={reporte} />
          ))}
        </ChildrenContainer>
      )}
    </Box>
  );
};

const HierarchyPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  // Cambiamos a null o un objeto vacío para indicar que la jerarquía no se ha cargado aún
  // y que esperamos un objeto con la estructura que devuelve la API.
  const [hierarchyData, setHierarchyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Departments for the dropdown
  const fetchDepartments = useCallback(async () => {
    console.log("fetchDepartments: Iniciando carga de departamentos...");
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departamentos?select=true`, config);
      setDepartments(response.data);
      console.log("fetchDepartments: Departamentos cargados:", response.data);
    } catch (err) {
      console.error('fetchDepartments: Error al cargar departamentos:', err);
      toast.error('Error al cargar la lista de departamentos.');
    }
  }, []);

  // 2. Fetch Hierarchy based on selected Department
  const fetchHierarchy = useCallback(async (deptId) => {
    console.log("fetchHierarchy: Intentando cargar jerarquía para deptId:", deptId);
    if (!deptId) {
      setHierarchyData(null); // Reset hierarchy data if no department selected
      console.log("fetchHierarchy: deptId es nulo o vacío, reseteando jerarquía.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/empleados/jerarquia/${deptId}`;
      console.log("fetchHierarchy: Llamando a la API:", apiUrl);
      const response = await axios.get(apiUrl, config);
      
      // >>>>>>>>>> C A M B I O   C R Í T I C O   A Q U Í <<<<<<<<<<<<
      // Guardar el objeto completo de la respuesta, no solo el array.
      // Luego, al renderizar, accederemos a `hierarchyData.estructura_organizacional`
      setHierarchyData(response.data); 
      console.log("fetchHierarchy: Jerarquía cargada (objeto completo):", response.data);

      if (response.data.estructura_organizacional && response.data.estructura_organizacional.length === 0) {
        toast.info('No se encontró jerarquía de empleados en este departamento.');
        console.log("fetchHierarchy: Jerarquía vacía (estructura_organizacional vacía).");
      }
    } catch (err) {
      console.error('fetchHierarchy: Error al cargar jerarquía:', err);
      setError(err);
      toast.error('Error al cargar la jerarquía de empleados.');
      setHierarchyData(null); // Reset on error
    } finally {
      setLoading(false);
      console.log("fetchHierarchy: Carga finalizada para deptId:", deptId);
    }
  }, []);

  useEffect(() => {
    console.log("useEffect [fetchDepartments]: Se monta el componente, cargando departamentos.");
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    console.log("useEffect [selectedDepartmentId, fetchHierarchy]: selectedDepartmentId cambió a:", selectedDepartmentId);
    if (selectedDepartmentId) {
      fetchHierarchy(selectedDepartmentId);
    }
  }, [selectedDepartmentId, fetchHierarchy]);

  const handleDepartmentChange = (event) => {
    console.log("handleDepartmentChange: Valor seleccionado:", event.target.value);
    setSelectedDepartmentId(event.target.value);
  };

  console.log("Renderizando HierarchyPage. Estado actual - selectedDepartmentId:", selectedDepartmentId, "hierarchyData:", hierarchyData, "loading:", loading, "error:", error);

  // Helper para verificar si hay datos de estructura para mostrar
  const hasHierarchyToDisplay = hierarchyData && hierarchyData.estructura_organizacional && hierarchyData.estructura_organizacional.length > 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Reporte de Jerarquía por Departamento
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel id="department-select-label">Selecciona un Departamento</InputLabel>
          <Select
            labelId="department-select-label"
            id="department-select"
            value={selectedDepartmentId}
            label="Selecciona un Departamento"
            onChange={handleDepartmentChange}
          >
            <MenuItem value="">
              <em>Ninguno</em>
            </MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedDepartmentId && loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Cargando jerarquía...</Typography>
        </Box>
      ) : selectedDepartmentId && error ? (
        <Typography variant="body1" color="error" sx={{ mt: 4, textAlign: 'center' }}>
          Error: {error.message || 'No se pudo cargar la jerarquía.'}
        </Typography>
      ) : selectedDepartmentId && hasHierarchyToDisplay ? (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}>
          {/* Opcional: Mostrar información del departamento y jefe de departamento */}
          {hierarchyData.departamento && (
            <Typography variant="h6" gutterBottom>
              Departamento: {hierarchyData.departamento.nombre}
            </Typography>
          )}
          {hierarchyData.jefe_departamento && (
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              Jefe de Departamento: {hierarchyData.jefe_departamento.nombre} {hierarchyData.jefe_departamento.apellido}
            </Typography>
          )}

          <Typography variant="h6" sx={{ mb: 2 }}>Estructura Organizacional:</Typography>
          {console.log("Mostrando jerarquía con datos (estructura_organizacional):", hierarchyData.estructura_organizacional)}
          {hierarchyData.estructura_organizacional.map((employee) => (
            <HierarchyNode key={employee.id} employee={employee} />
          ))}
        </Box>
      ) : selectedDepartmentId && hierarchyData && hierarchyData.estructura_organizacional.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          No hay empleados definidos en una jerarquía para este departamento.
        </Typography>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          Por favor, selecciona un departamento para ver su jerarquía.
        </Typography>
      )}
    </Container>
  );
};

export default HierarchyPage;