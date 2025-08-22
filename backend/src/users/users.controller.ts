import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Put } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('role') role?: UserRole,
  ) {
    return this.userService.findAll({ name, email, address, role });
  }

  @Get('count')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getTotalCount() {
    return this.userService.getTotalCount();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put('password')
  updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, updatePasswordDto);
  }
}
