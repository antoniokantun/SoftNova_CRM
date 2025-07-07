// NotFound.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ROUTES } from '../utils/constants';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen p-4"
         style={{ backgroundColor: 'var(--surface-50)' }}>
      <Card className="w-full max-w-md text-center">
        <div className="flex flex-column align-items-center">
          <div className="flex align-items-center justify-content-center w-8rem h-8rem border-circle mb-4" 
               style={{ backgroundColor: 'var(--primary-color)20' }}>
            <i className="pi pi-exclamation-triangle text-6xl" 
               style={{ color: 'var(--primary-color)' }}></i>
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-bold mb-3">Página no encontrada</h2>
          
          <p className="text-color-secondary mb-5 line-height-3">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          
          <div className="flex gap-2 flex-wrap justify-content-center">
            <Button
              label="Ir al Dashboard"
              icon="pi pi-home"
              onClick={handleGoHome}
              className="p-button-outlined"
            />
            <Button
              label="Volver"
              icon="pi pi-arrow-left"
              onClick={handleGoBack}
              className="p-button-text"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;