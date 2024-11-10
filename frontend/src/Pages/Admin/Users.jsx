// src/Pages/Admin/UserManagement.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const UserManagement = ({ userName, userRole, handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const patients = response.data.filter(user => user.role_id === 3);
      setUsers(patients);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const deleteUser = (userId) => {
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
          await axios.delete(`http://localhost:3000/users/${userId}`);
          setUsers(users.filter(user => user.id !== userId));
          Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
        }
      }
    });
  };

  const openEditModal = (user) => {
    setEditingUser({ ...user, password: '' });
  };

  const closeModal = () => {
    setEditingUser(null);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/users/${editingUser.id}`, {
        username: editingUser.username,
        email: editingUser.email,
        password: editingUser.password || null
      });
      fetchUsers();
      closeModal();
      Swal.fire('Actualizado', 'El usuario ha sido actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
    }
  };

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} userName={userName} userRole={userRole} />
      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          handleLogout={handleLogout} 
        />
        <div className="p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-8 text-center">Gestión de Usuarios (Pacientes)</h1>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">ID</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Nombre de Usuario</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Correo Electrónico</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="text-center hover:bg-gray-100">
                    <td className="py-4 px-6 border-b">{user.id}</td>
                    <td className="py-4 px-6 border-b">{user.username}</td>
                    <td className="py-4 px-6 border-b">{user.email}</td>
                    <td className="py-4 px-6 border-b flex justify-center space-x-6">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-500 hover:text-blue-700 transform hover:scale-105 transition duration-200"
                      >
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transform hover:scale-105 transition duration-200"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-out z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md transform transition-all duration-300 ease-out scale-95">
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Usuario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre de Usuario</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nueva Contraseña (dejar en blanco para no cambiar)</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nueva contraseña"
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
