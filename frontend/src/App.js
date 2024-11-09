// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorList from './Pages/DashboardClient';
import Login from './Pages/Login';
import Register from './Pages/Register';

function App() {
  const [userName, setUserName] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<DoctorList userName={userName} setUserName={setUserName} />}
        />
        <Route path="/login" element={<Login setUserName={setUserName} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
