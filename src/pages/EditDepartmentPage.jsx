import React, { useState, useEffect } from 'react';
import DepartmentForm from '../components/DepartmentForm';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditDepartmentPage = () => {
  const { id } = useParams(); // Obtiene el ID del departamento de la URL
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar los datos del departamento específico al cargar la página
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Usa la variable de entorno de Vite
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departamentos/${id}`, config);
        setDepartment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el departamento para editar:', error);
        toast.error('Error al cargar los datos del departamento. Asegúrate que el ID es válido.');
        setLoading(false);
        navigate('/departamentos'); // Redirige a la lista si hay un error o no se encuentra
      }
    };
    fetchDepartment();
  }, [id, navigate]); // Dependencias: se ejecuta cuando el ID o navigate cambian

  // Función que se ejecuta al enviar el formulario de edición exitosamente
  const handleSuccess = (updatedDepartment) => {
    console.log('Departamento actualizado:', updatedDepartment);
    navigate('/departamentos'); // Redirige a la página de lista de departamentos
  };

  if (loading) {
    return <div className="text-center p-8 text-lg text-gray-700">Cargando departamento para editar...</div>;
  }

  if (!department) {
    return <div className="text-center p-8 text-lg text-red-600">Departamento no encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <DepartmentForm initialData={department} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditDepartmentPage;