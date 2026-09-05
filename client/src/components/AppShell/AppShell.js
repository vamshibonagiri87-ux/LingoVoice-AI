import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

export default function AppShell({ children, requireAuth = true }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const content = (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );

  if (requireAuth) {
    return <ProtectedRoute>{content}</ProtectedRoute>;
  }

  return content;
}
