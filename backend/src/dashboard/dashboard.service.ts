import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';

@Injectable()
export class DashboardService {
  constructor(
    private userService: UserService,
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  async getAdminStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.userService.getTotalCount(),
      this.storesService.getTotalCount(),
      this.ratingsService.getTotalCount(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async getStoreOwnerDashboard(storeId: number) {
    const [store, ratings] = await Promise.all([
      this.storesService.findOne(storeId),
      this.storesService.getStoreRatings(storeId),
    ]);

    return {
      store,
      ratings,
      averageRating: store.averageRating,
      totalRatings: store.totalRatings,
    };
  }
}
