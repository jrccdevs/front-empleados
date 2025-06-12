import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Slide
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

import { useAuth } from '../../context/ContextoAutenticacion';

const drawerWidth = 240;

function LayoutPrincipal() {
  const { usuario, cargando, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!usuario && window.location.pathname !== '/login') {
      navigate('/login');
    } else if (usuario && window.location.pathname === '/login') {
      navigate('/dashboard');
    }
  }, [usuario, navigate]);

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando aplicación...</Typography>
      </Box>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Departamentos', path: '/departamentos', icon: <ApartmentIcon /> },
    { label: 'Empleados', path: '/empleados', icon: <PeopleIcon /> },
    { label: 'Jerarquía', path: '/jerarquia', icon: <AccountTreeIcon /> }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const menuContent = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
        color: 'white',
        height: '100%',
        p: 1,
      }}
    >
      <Typography variant="h6" align="center" sx={{ py: 2, fontWeight: 'bold', color: '#00e5ff' }}>
        Menú Principal
      </Typography>
      <Divider sx={{ bgcolor: '#00e5ff' }} />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} onClick={() => handleNavigate(item.path)} sx={{ transition: '0.3s', '&:hover': { bgcolor: '#00e5ff33' } }}>
            <ListItemIcon sx={{ color: '#00e5ff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: '#00e5ff' }} />
      <Box sx={{ mt: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ mr: 1, color: '#00e5ff' }} />
          <Typography variant="body2">
            {usuario.email} ({usuario.rol})
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={cerrarSesion}
          sx={{
            color: '#00e5ff',
            borderColor: '#00e5ff',
            paddingBottom: '0',
            '&:hover': {
              backgroundColor: '#00e5ff22',
              borderColor: '#00e5ff',
            }
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Menú permanente para escritorio */}
      {!isMobile && (
        <Slide direction="right" in={!isMobile} mountOnEnter unmountOnExit>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
                color: 'white'
              }
            }}
          >
            {menuContent}
          </Drawer>
        </Slide>
      )}

      {/* AppBar para móvil */}
      {isMobile && (
        <AppBar position="fixed" sx={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">Gestión de Empleados</Typography>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer móvil */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
            color: 'white'
          }
        }}
      >
        {menuContent}
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: isMobile ? '64px' : 0,
          background: '#f4f6f8',
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default LayoutPrincipal;
