"use client"


import { FC, ReactNode } from 'react'; // Import FC from React to handle children typing
import { Sidebar } from '@/components/sidebar/index';

const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex max-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default DashboardLayout;
