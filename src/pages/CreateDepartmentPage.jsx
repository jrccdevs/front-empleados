import React from 'react';
import DepartmentForm from '../components/DepartmentForm';
import { useNavigate } from 'react-router-dom';

const CreateDepartmentPage = () => {
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario exitosamente
  const handleSuccess = (newDepartment) => {
    console.log('Departamento creado:', newDepartment);
    navigate('/departamentos'); // Redirige a la página de lista de departamentos
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <DepartmentForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreateDepartmentPage;