import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const DashboardDoc = ({ userName, userRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} userName={userName} userRole={userRole} />
      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          handleLogout={handleLogout} 
        />

        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
          <h1 className="text-3xl font-bold">Bienvenido al Panel de Doctor</h1>
          <p className="mt-4 text-gray-600">Aquí podrás ver y gestionar tus citas y otros datos importantes.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoc;
