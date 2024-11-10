import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DoctorListComponent from './Pages/Client/DashboardClient';
import Login from './Auth/Login';
import Register from './Auth/Register';
import AdminRoles from './Pages/Admin/AdminRoles';
import DashboardDoc from './Pages/Doctor/DashboardDoc';

function App() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserName = localStorage.getItem('username');
    const savedUserRole = localStorage.getItem('role');
    if (savedUserName && savedUserRole) {
      setUserName(savedUserName);
      setUserRole(Number(savedUserRole));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (userName && userRole !== null) {
      localStorage.setItem('username', userName);
      localStorage.setItem('role', userRole);
    }
  }, [userName, userRole]);

  const handleLogout = () => {
    setUserName(null);
    setUserRole(null);
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  const ProtectedRoute = ({ roleRequired, children }) => {
    if (isLoading) return null;
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
        <div>Cargando...</div>
      ) : (
        <Routes>
 <Route
  path="/"
  element={
    <DoctorListComponent
      userName={userName}
      setUserName={setUserName}
      userRole={userRole}
      handleLogout={handleLogout} 
    />
  }
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
                <AdminRoles
                  userName={userName}
                  userRole={userRole}
                  setUserName={setUserName}
                  setUserRole={setUserRole}
                  handleLogout={handleLogout} 
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-doc"
            element={
              <ProtectedRoute roleRequired={2}>
                <DashboardDoc
                  userName={userName}
                  userRole={userRole}
                  setUserName={setUserName}
                  setUserRole={setUserRole}
                  handleLogout={handleLogout} 
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

export default App;
