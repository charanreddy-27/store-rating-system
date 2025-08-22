import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Store } from '../entities/store.entity';
import { CreateRatingDto, UpdateRatingDto } from '../dto/rating.dto';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private storesService: StoresService,
  ) {}

  async create(userId: number, createRatingDto: CreateRatingDto): Promise<Rating> {
    // Check if store exists
    const store = await this.storeRepository.findOne({ where: { id: createRatingDto.storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check if user already rated this store
    const existingRating = await this.ratingRepository.findOne({
      where: { userId, storeId: createRatingDto.storeId },
    });

    if (existingRating) {
      throw new BadRequestException('You have already rated this store');
    }

    const rating = this.ratingRepository.create({
      ...createRatingDto,
      userId,
    });

    const savedRating = await this.ratingRepository.save(rating);
    
    // Update store's average rating
    await this.storesService.updateStoreRating(createRatingDto.storeId);
    
    return savedRating;
  }

  async update(userId: number, ratingId: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { id: ratingId, userId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found or you are not authorized to update it');
    }

    await this.ratingRepository.update(ratingId, updateRatingDto);
    
    // Update store's average rating
    await this.storesService.updateStoreRating(rating.storeId);
    
    const updatedRating = await this.ratingRepository.findOne({ where: { id: ratingId } });
    if (!updatedRating) {
      throw new NotFoundException('Rating not found after update');
    }
    return updatedRating;
  }

  async findUserRatingForStore(userId: number, storeId: number): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { userId, storeId },
    });
  }

  async findAllWithStoreInfo(userId?: number) {
    const queryBuilder = this.ratingRepository
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.store', 'store')
      .leftJoinAndSelect('rating.user', 'user')
      .select([
        'rating.id',
        'rating.rating',
        'rating.comment',
        'rating.createdAt',
        'store.id',
        'store.name',
        'store.address',
        'store.averageRating',
        'user.id',
        'user.name',
      ]);

    if (userId) {
      queryBuilder.where('rating.userId = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  async getTotalCount(): Promise<number> {
    return this.ratingRepository.count();
  }
}
