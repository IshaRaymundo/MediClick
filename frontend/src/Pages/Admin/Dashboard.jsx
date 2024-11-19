import React from 'react';
import { FaUserFriends, FaStethoscope } from 'react-icons/fa';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ userName, userRole, setUserName, setUserRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(false);
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Usuarios',
      icon: <FaUserFriends className="absolute top-4 right-4 text-white text-5xl opacity-20" />,
      description: 'Gestiona todos los usuarios registrados.',
      bgColor: 'bg-green-500',
      route: '/Users-Admin',
    },
    {
      title: 'Especialidades',
      icon: <FaStethoscope className="absolute top-4 right-4 text-white text-5xl opacity-20" />,
      description: 'Administra la información de las especialidades médicas.',
      bgColor: 'bg-purple-500',
      route: '/especialidades',
    },
    

  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="flex">
      <Sidebar isExpanded={isSidebarExpanded} userName={userName} userRole={userRole} handleLogout={handleLogout}/>
      <div className="flex-1">
      <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Dashboard de Administración</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(card.route)}
                className={`${card.bgColor} text-white p-6 rounded-lg shadow-lg relative cursor-pointer transform transition-transform duration-300 hover:scale-105`}
              >
                {card.icon}
                <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
                <p className="text-sm opacity-80">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
