import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  CalendarIcon, 
  PlusCircleIcon, 
  ClipboardDocumentListIcon, 
  BriefcaseIcon, 
  UsersIcon, 
  ShieldCheckIcon, 
  HomeIcon 
} from '@heroicons/react/24/outline';

const Sidebar = ({ userName, userRole, isExpanded }) => {
  return (
    <div className={`flex flex-col items-center ${isExpanded ? 'w-64' : 'w-16'} bg-blue-200 h-screen p-4 transition-width duration-300`}>
      <div className="flex flex-col items-center mb-8 mt-12">
        <UserIcon className="w-10 h-10 text-blue-800 mb-2" />
        {isExpanded && (
          <span className="font-medium text-2xl transition-opacity duration-300 opacity-100">
            {userName}
          </span>
        )}
      </div>
      <div className="w-full">
        {isExpanded && (
          <p className="text-lg font-bold mb-9 transition-opacity duration-300 opacity-100">
            Menú
          </p>
        )}

        {/* Opciones para Paciente */}
        {userRole === 3 && (
          <>
            <Link to="/" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <HomeIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Home</span>}
            </Link>
            <Link to="/reservar-citas" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <PlusCircleIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Reservar citas</span>}
            </Link>
            <Link to="/mis-citas" className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <CalendarIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Mis citas</span>}
            </Link>
          </>
        )}

        {/* Opciones para Doctor */}
        {userRole === 2 && (
          <>
            <Link to="/dashboard-doc" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <HomeIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Home</span>}
            </Link>
            <Link to="/mis-pacientes" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <ClipboardDocumentListIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Mis Pacientes</span>}
            </Link>
            <Link to="/citas" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <CalendarIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Citas</span>}
            </Link>
            <Link to="/agenda" className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <BriefcaseIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Agenda</span>}
            </Link>
          </>
        )}

        {/* Opciones para Admin */}
        {userRole === 1 && (
          <>
            <Link to="/admin-dashboard" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <HomeIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Home</span>}
            </Link>
            <Link to="/Users-Admin" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <UsersIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Usuarios</span>}
            </Link>
            <Link to="/admin-roles" className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <ShieldCheckIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Roles</span>}
            </Link>
            <Link to="/doctores" className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 text-blue-800">
              <ClipboardDocumentListIcon className="w-8 h-8" />
              {isExpanded && <span className="ml-4">Doctores</span>}
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
