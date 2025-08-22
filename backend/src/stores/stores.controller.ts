import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from '../dto/store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('address') address?: string,
  ) {
    return this.storesService.findAll({ name, address });
  }

  @Get('count')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getTotalCount() {
    return this.storesService.getTotalCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Get(':id/ratings')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STORE_OWNER, UserRole.ADMIN)
  getStoreRatings(@Param('id') id: string, @Request() req) {
    // Store owners can only see their own store ratings
    if (req.user.role === UserRole.STORE_OWNER && req.user.id !== +id) {
      return [];
    }
    return this.storesService.getStoreRatings(+id);
  }
}
