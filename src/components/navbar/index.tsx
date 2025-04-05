// components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  userName: string; // Dynamic name passed from the parent component
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="text-2xl font-medium text-gray-700">
        Welcome, {userName}!
      </div>
    </div>
  );
};

export default Navbar;
