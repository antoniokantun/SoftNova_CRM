export interface Lead {
  id: number;
  nombre_completo: string;
  correo: string;
  telefono?: string;
  servicio_id: number;
  servicio?: string;
  mensaje?: string;
  estado: 'nuevo' | 'contactado' | 'descartado';
  fecha_envio: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
}

export interface UpdateLeadStatusRequest {
  estado: 'nuevo' | 'contactado' | 'descartado';
}