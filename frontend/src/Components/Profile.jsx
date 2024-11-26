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
    fotoUrl: null,
    informacion: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener todos los usuarios y doctores
        const [usersResponse, doctorsResponse] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/doctores"),
        ]);

        // Encontrar datos del usuario
        const user = usersResponse.data.find((u) => u.id === parseInt(userId));
        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // Si es doctor, obtener información adicional
        let doctorData = {};
        if (userRole === 2) {
          const doctor = doctorsResponse.data.find(
            (d) => d.username === user.username
          );
          if (doctor) {
            doctorData = {
              fotoUrl: doctor.fotoUrl || null,
              informacion: doctor.informacion || "",
            };
          }
        }

        setFormData({
          username: user.username || "Cargando...",
          email: user.email || "Cargando...",
          password: "",
          ...doctorData,
        });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos del perfil.",
          "error"
        );
      }
    };

    fetchUserData();
  }, [userId, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        fotoUrl: file,
      });
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("imagePreview").src = reader.result;
      };
      reader.readAsDataURL(file);
    }
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
        Swal.fire(
          "Edición habilitada",
          "Ahora puedes modificar tus datos.",
          "success"
        );
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
          // Actualizar datos del usuario
          const userPayload = {
            username: formData.username,
            email: formData.email,
            role_id: userRole,
          };

          if (formData.password) {
            userPayload.password = formData.password;
          }

          await axios.put(`http://localhost:3000/users/${userId}`, userPayload);

          // Si es un doctor, actualizar su foto e información
          if (userRole === 2) {
            const doctorPayload = new FormData();
            if (formData.fotoUrl instanceof File) {
              doctorPayload.append("fotoUrl", formData.fotoUrl);
            } else {
              doctorPayload.append("fotoUrl", ""); // Asegura que siempre se envíe este campo
            }
            doctorPayload.append("informacion", formData.informacion || "");

            await axios.put(
              `http://localhost:3000/doctores/${userId}`,
              doctorPayload,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          }

          setIsEditing(false);
          Swal.fire(
            "¡Guardado!",
            "Tus datos han sido actualizados correctamente.",
            "success"
          );
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
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 w-1/3"
                >
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
                    isEditing
                      ? "focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                />
              </div>
              <div className="mb-4 flex items-center">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 w-1/3"
                >
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
                    isEditing
                      ? "focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-200 cursor-not-allowed"
                  }`}
                />
              </div>
              {userRole === 2 && (
                <>
                  {/* Campo para subir imagen */}
                  <div className="mb-4 flex items-center">
                    <label
                      htmlFor="fotoUrl"
                      className="block text-sm font-medium text-gray-700 w-1/3"
                    >
                      Imagen de Perfil
                    </label>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="fotoUrl"
                        name="fotoUrl"
                        onChange={handleImageChange}
                        disabled={!isEditing}
                        className={`p-2 border rounded-lg focus:outline-none ${
                          isEditing
                            ? "focus:ring-2 focus:ring-blue-500"
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                      />
                      {/* Vista previa de la imagen */}
                      <img
                        id="imagePreview"
                        alt="Vista previa"
                        className="mt-2 w-24 h-24 rounded-full object-cover"
                        src={
                          formData.fotoUrl instanceof File
                            ? ""
                            : formData.fotoUrl
                            ? `http://localhost:3000/${formData.fotoUrl}`
                            : "/placeholder-image.png"
                        }
                      />
                    </div>
                  </div>

                  {/* Campo para la descripción */}
                  <div className="mb-4 flex items-center">
                    <label
                      htmlFor="informacion"
                      className="block text-sm font-medium text-gray-700 w-1/3"
                    >
                      Descripción
                    </label>
                    <textarea
                      id="informacion"
                      name="informacion"
                      value={formData.informacion}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`flex-1 p-2 border rounded-lg focus:outline-none resize-none ${
                        isEditing
                          ? "focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-200 cursor-not-allowed"
                      }`}
                      rows={4}
                    ></textarea>
                  </div>
                </>
              )}

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
