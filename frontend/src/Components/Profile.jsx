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
    especialidades: "",
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [usersResponse, doctorsResponse] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/doctores"),
        ]);

        const user = usersResponse.data.find((u) => u.id === parseInt(userId));
        if (!user) throw new Error("Usuario no encontrado");

        let doctorData = {};
        if (userRole === 2) {
          const doctor = doctorsResponse.data.find(
            (d) => d.username === user.username
          );
          if (doctor) {
            doctorData = {
              fotoUrl: doctor.fotoUrl || null,
              informacion: doctor.informacion || "",
              especialidades: doctor.especialidades || "No registrada",
            };
          }
        }

        setFormData({
          username: user.username,
          email: user.email,
          password: "",
          ...doctorData,
        });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        Swal.fire("Error", "No se pudieron cargar los datos del perfil.", "error");
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
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    Swal.fire("Edición habilitada", "Ahora puedes modificar tus datos.", "success");
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
          const userPayload = {
            username: formData.username,
            email: formData.email,
            role_id: userRole,
          };

          if (formData.password) userPayload.password = formData.password;

          await axios.put(`http://localhost:3000/users/${userId}`, userPayload);

          if (userRole === 2) {
            const doctorPayload = new FormData();
            if (formData.fotoUrl instanceof File) {
              doctorPayload.append("fotoUrl", formData.fotoUrl);
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
          Swal.fire("¡Guardado!", "Tus datos han sido actualizados correctamente.", "success");
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
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
            {userRole === 2 && (
              <div className="flex items-start space-x-8">
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        formData.fotoUrl instanceof File
                          ? URL.createObjectURL(formData.fotoUrl)
                          : formData.fotoUrl
                          ? `http://localhost:3000/${formData.fotoUrl}`
                          : "/placeholder-image.png"
                      }
                      alt="Doctor Profile"
                    />
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="fotoUrl"
                      className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer"
                    >
                      +
                    </label>
                  )}
                  <input
                    type="file"
                    id="fotoUrl"
                    name="fotoUrl"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{formData.username}</h1>
                  <p className="text-lg text-gray-600 mt-2">
                    <strong>Especialidad en</strong> {formData.especialidades}
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <p className="text-gray-500">{formData.informacion}</p>
                  </div>
                  {isEditing && (
                    <textarea
                      id="informacion"
                      name="informacion"
                      value={formData.informacion}
                      onChange={handleInputChange}
                      className="mt-4 w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    ></textarea>
                  )}
                </div>
              </div>
            )}
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700">Nueva Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Ingrese nueva contraseña (opcional)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={isEditing ? handleSaveClick : handleEditClick}
              className={`w-full mt-6 px-4 py-2 rounded-lg text-white ${
                isEditing ? "bg-teal-600 hover:bg-teal-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEditing ? "Guardar" : "Editar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
