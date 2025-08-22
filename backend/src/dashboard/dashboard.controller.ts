import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('store-owner')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  getStoreOwnerDashboard(@Request() req) {
    return this.dashboardService.getStoreOwnerDashboard(req.user.id);
  }
}
