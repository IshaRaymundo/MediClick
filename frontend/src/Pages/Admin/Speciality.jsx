import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';

const EspecialidadesManagement = ({ userName, userRole, handleLogout }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [editingEspecialidad, setEditingEspecialidad] = useState(null);
  const [newEspecialidad, setNewEspecialidad] = useState({ nombre: '', descripcion: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const fetchEspecialidades = async () => {
    try {
      const response = await axios.get('http://localhost:3000/especialidades');
      setEspecialidades(response.data);
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
    }
  };

  const deleteEspecialidad = (especialidadId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/especialidades/${especialidadId}`);
          setEspecialidades(especialidades.filter(especialidad => especialidad.id !== especialidadId));
          Swal.fire('Eliminado', 'La especialidad ha sido eliminada.', 'success');
        } catch (error) {
          console.error('Error al eliminar especialidad:', error);
          Swal.fire('Error', 'No se pudo eliminar la especialidad.', 'error');
        }
      }
    });
  };

  const openEditModal = (especialidad) => {
    setEditingEspecialidad({ ...especialidad });
  };

  const closeModal = () => {
    setEditingEspecialidad(null);
    setIsAddModalOpen(false);
    setNewEspecialidad({ nombre: '', descripcion: '' });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/especialidades/${editingEspecialidad.id}`, {
        nombre: editingEspecialidad.nombre,
        descripcion: editingEspecialidad.descripcion
      });
      fetchEspecialidades();
      closeModal();
      Swal.fire('Actualizado', 'La especialidad ha sido actualizada correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar especialidad:', error);
      Swal.fire('Error', 'No se pudo actualizar la especialidad.', 'error');
    }
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(`http://localhost:3000/especialidades`, {
        nombre: newEspecialidad.nombre,
        descripcion: newEspecialidad.descripcion
      });
      fetchEspecialidades();
      closeModal();
      Swal.fire('Especialidad creada', 'La nueva especialidad ha sido agregada exitosamente.', 'success');
    } catch (error) {
      console.error('Error al agregar especialidad:', error);
      Swal.fire('Error', 'No se pudo agregar la especialidad.', 'error');
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = especialidades.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(especialidades.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} userName={userName} userRole={userRole} handleLogout={handleLogout}/>
      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className="p-8 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestión de Especialidades</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Agregar Especialidad
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">ID</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Nombre</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Descripción</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(especialidad => (
                  <tr key={especialidad.id} className="text-center hover:bg-gray-100">
                    <td className="py-4 px-6 border-b">{especialidad.id}</td>
                    <td className="py-4 px-6 border-b">{especialidad.nombre}</td>
                    <td className="py-4 px-6 border-b">{especialidad.descripcion}</td>
                    <td className="py-4 px-6 border-b flex justify-center space-x-6">
                      <button
                        onClick={() => openEditModal(especialidad)}
                        className="text-blue-500 hover:text-blue-700 transform hover:scale-105 transition duration-200"
                      >
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => deleteEspecialidad(especialidad.id)}
                        className="text-red-500 hover:text-red-700 transform hover:scale-105 transition duration-200"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page + 1)}
                  className={`mx-1 px-3 py-1 rounded-md ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar especialidad */}
      {editingEspecialidad && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-out z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md transform transition-all duration-300 ease-out scale-95">
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Especialidad</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={editingEspecialidad.nombre}
                  onChange={(e) => setEditingEspecialidad({ ...editingEspecialidad, nombre: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Descripción</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md"
                  rows="4"
                  value={editingEspecialidad.descripcion}
                  onChange={(e) => setEditingEspecialidad({ ...editingEspecialidad, descripcion: e.target.value })}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar especialidad */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-out z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md transform transition-all duration-300 ease-out scale-95">
            <h2 className="text-2xl font-bold mb-4 text-center">Agregar Especialidad</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddSubmit(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={newEspecialidad.nombre}
                  onChange={(e) => setNewEspecialidad({ ...newEspecialidad, nombre: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Descripción</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md"
                  rows="4"
                  value={newEspecialidad.descripcion}
                  onChange={(e) => setNewEspecialidad({ ...newEspecialidad, descripcion: e.target.value })}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspecialidadesManagement;