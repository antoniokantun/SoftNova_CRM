import api from './api';
import type { Lead, UpdateLeadStatusRequest } from '../types/leads.types';

export const leadsService = {
  getLeads: async (page: number = 1, limit: number = 10): Promise<Lead[]> => {
    const response = await api.get(`/leads?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateLeadStatus: async (id: number, status: UpdateLeadStatusRequest): Promise<void> => {
    await api.put(`/leads/${id}/estado`, status);
  },

  getLeadById: async (id: number): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  }
};