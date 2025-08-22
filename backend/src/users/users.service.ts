import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdatePasswordDto } from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result as User;
  }

  async findAll(filters?: { name?: string; email?: string; address?: string; role?: UserRole }): Promise<User[]> {
    const query: any = {};
    
    if (filters?.name) {
      query.name = Like(`%${filters.name}%`);
    }
    if (filters?.email) {
      query.email = Like(`%${filters.email}%`);
    }
    if (filters?.address) {
      query.address = Like(`%${filters.address}%`);
    }
    if (filters?.role) {
      query.role = filters.role;
    }

    const users = await this.userRepository.find({
      where: query,
      select: ['id', 'name', 'email', 'address', 'role', 'rating', 'createdAt', 'updatedAt'],
    });
    
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'address', 'role', 'rating', 'createdAt', 'updatedAt'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
    await this.userRepository.update(userId, { password: hashedNewPassword });
  }

  async getTotalCount(): Promise<number> {
    return this.userRepository.count();
  }
}
