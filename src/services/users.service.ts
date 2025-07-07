import api from './api';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/users.types';

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }
};