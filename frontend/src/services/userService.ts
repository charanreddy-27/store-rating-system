import api from './api';
import { User } from './authService';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: 'admin' | 'normal_user' | 'store_owner';
}

export const userService = {
  async getUsers(filters?: { name?: string; email?: string; address?: string; role?: string }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.role) params.append('role', filters.role);
    
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async getUserCount(): Promise<number> {
    const response = await api.get('/users/count');
    return response.data;
  },
};
