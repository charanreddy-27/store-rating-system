import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Store } from '../entities/store.entity';
import { Rating } from '../entities/rating.entity';
import { CreateStoreDto } from '../dto/store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const hashedPassword = await bcrypt.hash(createStoreDto.password, 10);
    const store = this.storeRepository.create({
      ...createStoreDto,
      password: hashedPassword,
    });
    const savedStore = await this.storeRepository.save(store);
    const { password, ...result } = savedStore;
    return result as Store;
  }

  async findAll(filters?: { name?: string; address?: string }): Promise<Store[]> {
    const query: any = {};
    
    if (filters?.name) {
      query.name = Like(`%${filters.name}%`);
    }
    if (filters?.address) {
      query.address = Like(`%${filters.address}%`);
    }

    const stores = await this.storeRepository.find({
      where: query,
      select: ['id', 'name', 'email', 'address', 'averageRating', 'totalRatings', 'createdAt', 'updatedAt'],
      order: { name: 'ASC' },
    });
    
    return stores;
  }

  async findOne(id: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'address', 'averageRating', 'totalRatings', 'createdAt', 'updatedAt'],
    });
    
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    
    return store;
  }

  async getStoreRatings(storeId: number) {
    const ratings = await this.ratingRepository.find({
      where: { storeId },
      relations: ['user'],
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
    
    return ratings;
  }

  async updateStoreRating(storeId: number): Promise<void> {
    const ratings = await this.ratingRepository.find({ where: { storeId } });
    
    if (ratings.length === 0) {
      await this.storeRepository.update(storeId, {
        averageRating: 0,
        totalRatings: 0,
      });
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = Number((totalRating / ratings.length).toFixed(2));

    await this.storeRepository.update(storeId, {
      averageRating,
      totalRatings: ratings.length,
    });
  }

  async getTotalCount(): Promise<number> {
    return this.storeRepository.count();
  }
}
