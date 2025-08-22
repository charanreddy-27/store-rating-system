import api from './api';

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboard {
  store: {
    id: number;
    name: string;
    email: string;
    address: string;
    averageRating: number;
    totalRatings: number;
  };
  ratings: Array<{
    id: number;
    rating: number;
    comment?: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  averageRating: number;
  totalRatings: number;
}

export const dashboardService = {
  async getAdminStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  async getStoreOwnerDashboard(): Promise<StoreOwnerDashboard> {
    const response = await api.get('/dashboard/store-owner');
    return response.data;
  },
};
