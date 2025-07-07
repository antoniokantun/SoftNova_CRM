import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div className="layout">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="layout-content">
        <Sidebar visible={sidebarVisible} onHide={closeSidebar} />
        <main className="main-content">
          <div className="p-3 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;