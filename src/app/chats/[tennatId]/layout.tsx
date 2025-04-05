import React from "react";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-400 p-4 flex justify-center shadow-md">
        <h1 className="text-2xl font-bold text-white">DuneFox</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-white shadow-inner rounded-md mx-4 mt-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 p-4 text-center mt-auto">
        <p className="text-blue-100 font-medium">© 2024 SUNNY DHAKANE.</p>
      </footer>
    </div>
  );
};

export default Layout;
