import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DoctorListComponent from './Pages/Client/DashboardClient';
import Login from './Auth/Login';
import Register from './Auth/Register';
import DashboardDoc from './Pages/Doctor/DashboardDoc';
import Dashboard from './Pages/Admin/Dashboard';
import UserManagement from './Pages/Admin/Users';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import ScheduleAppointment from './Pages/Client/ScheduleAppointment';
import Appointments from './Pages/Client/Appointments';
import UserProfile from './Components/Profile';
import EspecialidadesManagement from './Pages/Admin/Speciality';
import Schedule from './Pages/Doctor/Schedule';
import AppointmentsDoc from './Pages/Doctor/AppointmentsDoc';

function App() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);



  useEffect(() => {
    const savedUserName = localStorage.getItem('username');
    const savedUserRole = localStorage.getItem('role');
    const savedUserEmail = localStorage.getItem('email');
    const savedUserId = localStorage.getItem('userId');
    console.log("userId cargado desde localStorage en App.js:", savedUserId);

    if (savedUserName && savedUserRole && savedUserId) {
      setUserName(savedUserName);
      setUserRole(Number(savedUserRole));
      setUserEmail(savedUserEmail || "Correo no disponible");
      setUserId(Number(savedUserId));
    }
    setIsLoading(false);
  }, []);



  useEffect(() => {
    if (userName && userRole !== null && userId !== null) {
      localStorage.setItem('username', userName);
      localStorage.setItem('role', userRole);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('userId', userId);
    }
  }, [userName, userRole, userEmail, userId]);


  const handleLogout = () => {
    setUserName(null);
    setUserRole(null);
    setUserEmail(null);
    setUserId(null);
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  };


  const ProtectedRoute = ({ roleRequired, children }) => {
    if (isLoading) return null;
    if (userRole === roleRequired) {
      return children;
    }
    if (userRole === 1) {
      return <Navigate to="/admin-dashboard" />;
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
            element={<Login setUserName={setUserName} setUserRole={setUserRole} setUserEmail={setUserEmail} />}
          />
          <Route
            path="/register"
            element={<Register setUserName={setUserName} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword setUserName={setUserName} setUserRole={setUserRole} />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword setUserName={setUserName} />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roleRequired={1}>
                <Dashboard
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
            path="/Users-Admin"
            element={
              <ProtectedRoute roleRequired={1}>
                <UserManagement
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
            path="/especialidades"
            element={
              <ProtectedRoute roleRequired={1}>
                <EspecialidadesManagement
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

          <Route
            path="/mis-pacientes"
            element={
              <ProtectedRoute roleRequired={2}>
                <AppointmentsDoc
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
            path="/Schedule-doc"
            element={
              <ProtectedRoute roleRequired={2}>
                <Schedule
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
            path="/schedule-appointment"
            element={
              <ProtectedRoute roleRequired={3}>
                <ScheduleAppointment
                  userName={userName}
                  userRole={userRole}
                  userId={userId} // Pasa userId como prop
                  setUserName={setUserName}
                  setUserRole={setUserRole}
                  handleLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute roleRequired={3}>
                <Appointments
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
            path="/perfil"
            element={
              <UserProfile
                userName={userName}
                userEmail={userEmail}
                userRole={userRole}
                handleLogout={handleLogout}
              />
            }
          />


        </Routes>
      )}
    </Router>
  );
}

export default App;
