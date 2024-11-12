import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';

const UserManagement = ({ userName, userRole, handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role_id: 3 });
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const filteredUsers = response.data.filter(user => 
        roleFilter === "all" ? true : user.role_id === (roleFilter === "doctor" ? 2 : 3)
      );
      setUsers(filteredUsers);
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
    setIsAddModalOpen(false);
    setNewUser({ username: '', email: '', password: '', role_id: 3 });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:3000/users/${editingUser.id}`, {
        username: editingUser.username,
        email: editingUser.email,
        password: editingUser.password || null,
        role_id: editingUser.role_id,
      });
      fetchUsers();
      closeModal();
      Swal.fire('Actualizado', 'El usuario ha sido actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
    }
  };

  const handleAddSubmit = async () => {
    try {
      await axios.post(`http://localhost:3000/admin/create-user`, {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role_id: newUser.role_id,
      });
      fetchUsers();
      closeModal();
      Swal.fire('Usuario creado', 'El nuevo usuario ha sido agregado exitosamente.', 'success');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire('Error', error.response.data.message, 'error');
      } else {
        console.error('Error al agregar usuario:', error);
        Swal.fire('Error', 'No se pudo agregar el usuario.', 'error');
      }
    }
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRoleChangeInModal = (newRoleId) => {
    setEditingUser((prev) => ({ ...prev, role_id: newRoleId }));
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <div className="flex space-x-4">
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los usuarios</option>
                <option value="doctor">Doctores</option>
                <option value="paciente">Pacientes</option>
              </select>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
              >
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Agregar Usuario
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead>
                <tr>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">ID</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Nombre de Usuario</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Correo Electrónico</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Rol Actual</th>
                  <th className="py-4 px-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(user => (
                  <tr key={user.id} className="text-center hover:bg-gray-100">
                    <td className="py-4 px-6 border-b">{user.id}</td>
                    <td className="py-4 px-6 border-b">{user.username}</td>
                    <td className="py-4 px-6 border-b">{user.email}</td>
                    <td className="py-4 px-6 border-b">
                      {user.role_id === 1 ? 'Admin' : user.role_id === 2 ? 'Doctor' : 'Paciente'}
                    </td>
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

      {/* Modal para editar usuario */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300 ease-out z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md transform transition-all duration-300 ease-out scale-95">
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Usuario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre de Usuario</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rol de Usuario</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editingUser.role_id === 1}
                      onChange={() => handleRoleChangeInModal(1)}
                    />
                    <span className="ml-2">Admin</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editingUser.role_id === 2}
                      onChange={() => handleRoleChangeInModal(2)}
                    />
                    <span className="ml-2">Doctor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editingUser.role_id === 3}
                      onChange={() => handleRoleChangeInModal(3)}
                    />
                    <span className="ml-2">Paciente</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nueva Contraseña (dejar en blanco para no cambiar)</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Nueva contraseña"
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar usuario */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md transform transition-all duration-300 ease-out scale-95">
            <h2 className="text-2xl font-bold mb-4 text-center">Agregar Usuario</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddSubmit(); }}>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre de Usuario</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-md"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Rol de Usuario</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newUser.role_id === 1}
                      onChange={() => setNewUser({ ...newUser, role_id: 1 })}
                    />
                    <span className="ml-2">Admin</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newUser.role_id === 2}
                      onChange={() => setNewUser({ ...newUser, role_id: 2 })}
                    />
                    <span className="ml-2">Doctor</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={newUser.role_id === 3}
                      onChange={() => setNewUser({ ...newUser, role_id: 3 })}
                    />
                    <span className="ml-2">Paciente</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
