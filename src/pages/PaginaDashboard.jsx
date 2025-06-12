import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

function PaginaDashboard() {
  return (
    <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 3 }, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Bienvenido al Dashboard
      </Typography>

      <Typography variant="body1" textAlign="center" sx={{ mb: 4 }}>
        Aquí se mostrarán las estadísticas y accesos rápidos de la aplicación.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Total de Empleados</Typography>
            <Typography variant="h4" color="primary">120</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Departamentos</Typography>
            <Typography variant="h4" color="secondary">8</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Usuarios Activos</Typography>
            <Typography variant="h4" color="success.main">25</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PaginaDashboard;
