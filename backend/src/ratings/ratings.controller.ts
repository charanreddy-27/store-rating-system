import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NORMAL_USER)
  create(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(req.user.id, createRatingDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NORMAL_USER)
  update(@Request() req, @Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingsService.update(req.user.id, +id, updateRatingDto);
  }

  @Get('user/:userId/store/:storeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.NORMAL_USER)
  getUserRatingForStore(@Param('userId') userId: string, @Param('storeId') storeId: string) {
    return this.ratingsService.findUserRatingForStore(+userId, +storeId);
  }

  @Get('count')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getTotalCount() {
    return this.ratingsService.getTotalCount();
  }

  @Get()
  findAll(@Request() req, @Query('userId') userId?: string) {
    // Normal users can only see their own ratings
    if (req.user.role === UserRole.NORMAL_USER) {
      return this.ratingsService.findAllWithStoreInfo(req.user.id);
    }
    // Admins can see all ratings or filter by user
    return this.ratingsService.findAllWithStoreInfo(userId ? +userId : undefined);
  }
}
