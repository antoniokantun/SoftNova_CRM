import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando...', 
  size = 'medium' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return '30px';
      case 'large': return '80px';
      default: return '50px';
    }
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center p-4">
      <ProgressSpinner 
        style={{ width: getSize(), height: getSize() }} 
        strokeWidth="4" 
        animationDuration="1s" 
      />
      {message && (
        <p className="mt-3 text-center text-color-secondary">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;