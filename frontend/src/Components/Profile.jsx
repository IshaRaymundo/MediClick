import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const UserProfile = ({ userName, userEmail, userRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: userName || "Cargando...",
    email: userEmail || "Cargando...",
    password: "",
  });

  const userId = localStorage.getItem("userId"); // Asegúrate de guardar el `id` en localStorage.

  useEffect(() => {
    console.log("userId from localStorage:", userId);
    setFormData({
      username: userName || "Cargando...",
      email: userEmail || "Cargando...",
      password: "",
    });
}, [userName, userEmail, userId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas habilitar la edición de tus datos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsEditing(true);
        Swal.fire("Edición habilitada", "Ahora puedes modificar tus datos.", "success");
      }
    });
  };

  const handleSaveClick = async () => {
    Swal.fire({
        title: "¿Guardar cambios?",
        text: "Se actualizarán tus datos en el sistema.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const payload = {};
                if (formData.username && formData.username !== "Cargando...") {
                    payload.username = formData.username;
                }
                if (formData.email && formData.email !== "Cargando...") {
                    payload.email = formData.email;
                }
                if (formData.password) {
                    payload.password = formData.password;
                }

                console.log('Payload enviado al backend:', payload);

                const response = await axios.put(`http://localhost:3000/users/${userId}`, payload);
                setIsEditing(false);
                Swal.fire("¡Guardado!", response.data.message, "success");
            } catch (error) {
                console.error("Error al actualizar datos:", error);
                Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
            }
        }
    });
};


  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        isExpanded={isSidebarExpanded}
        userName={userName}
        userRole={userRole}
        handleLogout={handleLogout}
      />
      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className="px-6 md:px-12 py-8 flex flex-col items-center">
          <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
              Perfil de Usuario
            </h2>
            <form>
              <div className="mb-4 flex items-center">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 w-1/3">
                  Nombre
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`flex-1 p-2 border rounded-lg focus:outline-none ${
                    isEditing ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-200 cursor-not-allowed"
                  }`}
                />
              </div>
              <div className="mb-4 flex items-center">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-1/3">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`flex-1 p-2 border rounded-lg focus:outline-none ${
                    isEditing ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-200 cursor-not-allowed"
                  }`}
                />
              </div>
              <div className="mb-6 flex items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 w-1/3">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="********"
                  className={`flex-1 p-2 border rounded-lg focus:outline-none ${
                    isEditing ? "focus:ring-2 focus:ring-blue-500" : "bg-gray-200 cursor-not-allowed"
                  }`}
                />
              </div>
              <div className="flex justify-end space-x-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Editar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  >
                    Guardar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
