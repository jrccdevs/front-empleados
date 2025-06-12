// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa el CSS de react-toastify

import { AuthProvider } from './context/ContextoAutenticacion.jsx';

import PaginaLogin from './pages/PaginaLogin';
import PaginaDashboard from './pages/PaginaDashboard';
//import ListaEmpleadosPagina from './pages/ListaEmpleadosPagina';
import CreateDepartmentPage from './pages/CreateDepartmentPage'
import EditDepartmentPage from './pages/EditDepartmentPage'
import ListaDepartamentosPagina from './pages/ListaDepartamentosPagina';
import DetalleDepartamentoPagina from './pages/DetalleDepartamentoPagina.jsx'; // <-- Nueva importación
//import PaginaJerarquia from './pages/PaginaJerarquia.jsx';
import LayoutPrincipal from './components/comun/LayoutPrincipal';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import HierarchyPage from './pages/HierarchyPage'; 


function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <Routes>
            {/* Ruta pública para el login */}
            <Route path="/login" element={<PaginaLogin />} />

            {/* Rutas protegidas - anidadas dentro de LayoutPrincipal */}
            <Route element={<LayoutPrincipal />}>
              <Route path="/" element={<PaginaDashboard />} />
              <Route path="/dashboard" element={<PaginaDashboard />} />

              {/* Rutas de Departamentos */}
              <Route path="/departamentos" element={<ListaDepartamentosPagina />} />
              <Route path="/departamentos/:id" element={<DetalleDepartamentoPagina />} /> {/* <-- Nueva ruta */}
              {/* Aquí irán las rutas para crear/editar departamentos más adelante */}
              <Route path="/departamentos/crear" element={<CreateDepartmentPage />} />
              <Route path="/departamentos/editar/:id" element={<EditDepartmentPage />} />

              <Route path="/empleados" element={<EmployeeListPage />} />
              <Route path="/empleados/:id" element={<EmployeeDetailPage />} />
              <Route path="/empleados/nuevo" element={<EmployeeFormPage />} />
              <Route path="/empleados/editar/:id" element={<EmployeeFormPage />} />
             

              <Route path="/jerarquia" element={<HierarchyPage />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;