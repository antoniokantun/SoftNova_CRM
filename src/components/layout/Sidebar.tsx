import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'; // Importa el Sidebar de PrimeReact
import { ROUTES } from '../../utils/constants';

interface SidebarProps {
  visible: boolean;
  onHide: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onHide }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => {
        navigate(ROUTES.DASHBOARD);
        onHide();
      },
      className: location.pathname === ROUTES.DASHBOARD ? 'active-menu-item' : ''
    },
    {
      label: 'Leads',
      icon: 'pi pi-users',
      command: () => {
        navigate(ROUTES.LEADS);
        onHide();
      },
      className: location.pathname === ROUTES.LEADS ? 'active-menu-item' : ''
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-user-plus',
      command: () => {
        navigate(ROUTES.USERS);
        onHide();
      },
      className: location.pathname === ROUTES.USERS ? 'active-menu-item' : ''
    },
    {
      separator: true
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      command: () => {
        // TODO: Implementar configuración
        console.log('Abrir configuración');
      }
    }
  ];

  return (
    <PrimeSidebar
      visible={visible}
      onHide={onHide}
      showCloseIcon
      dismissable
      className="p-sidebar-sm"
      style={{ width: '16rem' }}
    >
      <div className="sidebar-header p-3">
        <h3 className="text-primary font-bold">Menú</h3>
      </div>
      <Menu 
        model={menuItems} 
        className="w-full border-none bg-transparent"
      />
    </PrimeSidebar>
  );
};

export default Sidebar;