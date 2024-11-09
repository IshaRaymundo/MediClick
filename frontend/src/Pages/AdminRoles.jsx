// AdminRoles.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const AdminRoles = ({ userName, setUserName, setUserRole }) => {
  const [users, setUsers] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Obtiene usuarios de la base de datos
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  // Cambia el rol del usuario en la base de datos
  const changeRole = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:3000/users/${userId}/role`, { role_id: newRole });
      fetchUsers();
      Swal.fire('Rol actualizado', 'El rol del usuario ha sido cambiado con éxito.', 'success');
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el rol del usuario.', 'error');
    }
  };

  // Maneja el cambio de rol con confirmación
  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Realmente quieres cambiar el rol de este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        changeRole(userId, newRole);
      }
    });
  };

  // Cierra sesión
  const handleLogout = () => {
    setUserName(null);
    setUserRole(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} userName={userName} />
      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          setUserName={setUserName}
          handleLogout={handleLogout}
        />

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Administrar Roles</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Rol Actual</th>
                  <th className="py-2 px-4 border-b">Admin</th>
                  <th className="py-2 px-4 border-b">Doctor</th>
                  <th className="py-2 px-4 border-b">Paciente</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b text-center">{user.username}</td>
                    <td className="py-2 px-4 border-b text-center">
                      {user.role_id === 1
                        ? 'Admin'
                        : user.role_id === 2
                        ? 'Doctor'
                        : 'Paciente'}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <input
                        type="checkbox"
                        checked={user.role_id === 1}
                        onChange={() => handleRoleChange(user.id, user.role_id, 1)}
                      />
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <input
                        type="checkbox"
                        checked={user.role_id === 2}
                        onChange={() => handleRoleChange(user.id, user.role_id, 2)}
                      />
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <input
                        type="checkbox"
                        checked={user.role_id === 3}
                        onChange={() => handleRoleChange(user.id, user.role_id, 3)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoles;
