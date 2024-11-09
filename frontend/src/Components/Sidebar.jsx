import React from 'react';
import { UserIcon, CalendarIcon, PlusCircleIcon, ClipboardDocumentListIcon, BriefcaseIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ userName, userRole, isExpanded }) => {
  console.log("userRole in Sidebar:", userRole); 

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

        {userRole === 3 && (
          <>
            <div className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <PlusCircleIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Reservar citas</span>}
            </div>
            <div className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <CalendarIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Mis citas</span>}
            </div>
          </>
        )}

        {userRole === 2 && (
          <>
            <div className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <ClipboardDocumentListIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Mis Pacientes</span>}
            </div>
            <div className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <CalendarIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Citas</span>}
            </div>
            <div className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <BriefcaseIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Agenda</span>}
            </div>
          </>
        )}

        {userRole === 1 && (
          <>
            <div className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <UsersIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Usuarios</span>}
            </div>
            <div className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <ShieldCheckIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Roles</span>}
            </div>
            <div className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
              <ClipboardDocumentListIcon className="w-8 h-8 text-blue-800" />
              {isExpanded && <span className="ml-4">Doctores</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
