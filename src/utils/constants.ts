export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SoftNova CRM';

export const LEAD_STATES = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  descartado: 'Descartado'
} as const;

export const LEAD_STATE_COLORS = {
  nuevo: 'info',
  contactado: 'success',
  descartado: 'danger'
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LEADS: '/leads',
  USERS: '/users'
} as const;