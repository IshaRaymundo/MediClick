// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DoctorListComponent from './Pages/DashboardClient';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminRoles from './Pages/AdminRoles';
import DashboardDoc from './Pages/DashboardDoc';

function App() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null); // Almacena el rol del usuario
  const [isLoading, setIsLoading] = useState(true); // Controla la carga inicial

  // Revisa si el usuario tiene sesión activa al cargar la app
  useEffect(() => {
    const savedUserName = localStorage.getItem('username');
    const savedUserRole = localStorage.getItem('role');
    if (savedUserName && savedUserRole) {
      setUserName(savedUserName);
      setUserRole(Number(savedUserRole));
    }
    setIsLoading(false); // Cambia el estado de carga después de verificar
  }, []);

  // Guarda los datos en localStorage cuando cambian
  useEffect(() => {
    if (userName && userRole !== null) {
      localStorage.setItem('username', userName);
      localStorage.setItem('role', userRole);
    }
  }, [userName, userRole]);

  // Ruta protegida que redirige según el rol del usuario
  const ProtectedRoute = ({ roleRequired, children }) => {
    if (isLoading) return null; // Espera a que se complete la carga
    if (userRole === roleRequired) {
      return children;
    }
    if (userRole === 1) {
      return <Navigate to="/admin-roles" />;
    }
    if (userRole === 2) {
      return <Navigate to="/dashboard-doc" />;
    }
    return <Navigate to="/" />;
  };

  return (
    <Router>
      {isLoading ? (
        <div>Cargando...</div> // Muestra un indicador de carga mientras verifica la sesión
      ) : (
        <Routes>
          <Route
            path="/"
            element={<DoctorListComponent userName={userName} setUserName={setUserName} setUserRole={setUserRole} />}
          />
          <Route
            path="/login"
            element={<Login setUserName={setUserName} setUserRole={setUserRole} />}
          />
          <Route
            path="/register"
            element={<Register setUserName={setUserName} />}
          />
          <Route
            path="/admin-roles"
            element={
              <ProtectedRoute roleRequired={1}>
                <AdminRoles userName={userName} setUserName={setUserName} setUserRole={setUserRole} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-doc"
            element={
              <ProtectedRoute roleRequired={2}>
                <DashboardDoc userName={userName} setUserName={setUserName} setUserRole={setUserRole} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
