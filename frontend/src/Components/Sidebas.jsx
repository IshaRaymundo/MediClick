import React from 'react';
import { UserIcon, CalendarIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ userName, isExpanded }) => {
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

        <div className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
          <PlusCircleIcon className="w-8 h-8 text-blue-800" />
          {isExpanded && (
            <span className="ml-4 transition-opacity duration-300 opacity-100">
              Reservar citas
            </span>
          )}
        </div>

        <div className="flex items-center w-full p-2 rounded-lg hover:bg-blue-300 cursor-pointer">
          <CalendarIcon className="w-8 h-8 text-blue-800" />
          {isExpanded && (
            <span className="ml-4 transition-opacity duration-300 opacity-100">
              Mis citas
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
