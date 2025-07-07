import React from 'react';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import { APP_NAME } from '../../utils/constants';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const menuRight = React.useRef<Menu>(null);

  const userMenuItems = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      command: () => {
        // TODO: Implementar vista de perfil
        console.log('Abrir perfil');
      }
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: logout
    }
  ];

  const startContent = (
    <div className="flex align-items-center">
      <Button
        icon="pi pi-bars"
        className="p-button-text p-button-rounded mr-2"
        onClick={onToggleSidebar}
      />
      <span className="text-xl font-bold text-primary">{APP_NAME}</span>
    </div>
  );

  const endContent = (
    <div className="flex align-items-center">
      <span className="mr-2 font-medium hidden md:block">
        {user?.nombre}
      </span>
      <Avatar
        label={getInitials(user?.nombre || '')}
        className="cursor-pointer"
        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
        onClick={(e) => menuRight.current?.toggle(e)}
      />
      <Menu
        ref={menuRight}
        model={userMenuItems}
        popup
        className="mt-2"
      />
    </div>
  );

  return (
    <div className="surface-0 shadow-2 px-3 py-3 md:px-6 lg:px-8 border-bottom-1 border-300">
      <div className="flex justify-content-between align-items-center">
        {startContent}
        {endContent}
      </div>
    </div>
  );
};

export default Header;