import React, { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, title = 'Home' }) => {
  // Em produção, isto viria do contexto de autenticação
  const user = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'john@example.com'

  };

  useEffect(() => {
    // Bloquear scroll do body
    // document.body.style.overflow = 'hidden';

    // Cleanup para voltar ao scroll normal ao desmontar o Layout
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} user={user} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;