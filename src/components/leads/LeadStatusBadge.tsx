import React from 'react';
import { LEAD_STATES } from '../../utils/constants';

interface LeadStatusBadgeProps {
  status: 'nuevo' | 'contactado' | 'descartado';
  size?: 'small' | 'normal' | 'large';
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, size = 'normal' }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'pi pi-circle-fill';
      case 'contactado':
        return 'pi pi-check-circle';
      case 'descartado':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-circle';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo':
        return 'var(--primary-color)';
      case 'contactado':
        return 'var(--green-500)';
      case 'descartado':
        return 'var(--red-500)';
      default:
        return 'var(--surface-500)';
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'text-xs px-2 py-1';
      case 'large':
        return 'text-lg px-3 py-2';
      default:
        return 'text-sm px-2 py-1';
    }
  };

  return (
    <span 
      className={`inline-flex align-items-center border-round ${getSizeClass(size)}`}
      style={{ 
        backgroundColor: getStatusColor(status) + '20',
        color: getStatusColor(status),
        border: `1px solid ${getStatusColor(status)}40`
      }}
    >
      <i className={`${getStatusIcon(status)} mr-1`} style={{ fontSize: '0.8rem' }}></i>
      {LEAD_STATES[status]}
    </span>
  );
};

export default LeadStatusBadge;