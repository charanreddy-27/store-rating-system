import api from './api';

export interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
}

export interface CreateStoreData {
  name: string;
  email: string;
  password: string;
  address: string;
}

export const storeService = {
  async getStores(filters?: { name?: string; address?: string }): Promise<Store[]> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.address) params.append('address', filters.address);
    
    const response = await api.get(`/stores?${params}`);
    return response.data;
  },

  async getStore(id: number): Promise<Store> {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  async createStore(data: CreateStoreData): Promise<Store> {
    const response = await api.post('/stores', data);
    return response.data;
  },

  async getStoreRatings(storeId: number) {
    const response = await api.get(`/stores/${storeId}/ratings`);
    return response.data;
  },

  async getStoreCount(): Promise<number> {
    const response = await api.get('/stores/count');
    return response.data;
  },
};
