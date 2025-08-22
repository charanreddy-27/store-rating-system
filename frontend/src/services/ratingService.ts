import api from './api';

export interface Rating {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
  };
  store?: {
    id: number;
    name: string;
    address: string;
    averageRating: number;
  };
}

export interface CreateRatingData {
  rating: number;
  comment?: string;
  storeId: number;
}

export interface UpdateRatingData {
  rating: number;
  comment?: string;
}

export const ratingService = {
  async createRating(data: CreateRatingData): Promise<Rating> {
    const response = await api.post('/ratings', data);
    return response.data;
  },

  async updateRating(ratingId: number, data: UpdateRatingData): Promise<Rating> {
    const response = await api.put(`/ratings/${ratingId}`, data);
    return response.data;
  },

  async getUserRatingForStore(userId: number, storeId: number): Promise<Rating | null> {
    try {
      const response = await api.get(`/ratings/user/${userId}/store/${storeId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async getRatings(userId?: number): Promise<Rating[]> {
    const params = userId ? `?userId=${userId}` : '';
    const response = await api.get(`/ratings${params}`);
    return response.data;
  },

  async getRatingCount(): Promise<number> {
    const response = await api.get('/ratings/count');
    return response.data;
  },
};
