import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeeTable = ({ employees, onViewDetails, onEditEmployee, onDeleteEmployee }) => {
  if (employees.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
        No hay empleados para mostrar.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3, mb: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple employee table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Puesto</TableCell>
            <TableCell>Departamento</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {employee.nombre}
              </TableCell>
              <TableCell>{employee.apellido}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.puesto}</TableCell>
              <TableCell>
                {employee.departamento ? employee.departamento.nombre : 'N/A'}
              </TableCell>
              <TableCell>{employee.estado}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => onViewDetails(employee.id)}
                  sx={{ mr: 1 }}
                >
                  Ver
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="info"
                  startIcon={<EditIcon />}
                  onClick={() => onEditEmployee(employee.id)}
                  sx={{ mr: 1 }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDeleteEmployee(employee.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;