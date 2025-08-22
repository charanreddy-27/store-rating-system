import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Store } from '../entities/store.entity';
import { CreateUserDto, LoginDto } from '../dto/user.dto';
import { CreateStoreDto } from '../dto/store.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    
    // Check if it's a store owner
    const store = await this.storeRepository.findOne({ where: { email } });
    if (store && await bcrypt.compare(password, store.password)) {
      // Convert store to user-like object for consistency
      const storeAsUser = new User();
      storeAsUser.id = store.id;
      storeAsUser.email = store.email;
      storeAsUser.name = store.name;
      storeAsUser.address = store.address;
      storeAsUser.role = 'store_owner' as any;
      storeAsUser.rating = store.averageRating;
      return storeAsUser;
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role,
      name: user.name 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
        rating: user.rating,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async createStore(createStoreDto: CreateStoreDto) {
    const existingStore = await this.storeRepository.findOne({ 
      where: { email: createStoreDto.email } 
    });
    
    if (existingStore) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createStoreDto.password, 10);
    const store = this.storeRepository.create({
      ...createStoreDto,
      password: hashedPassword,
    });

    const savedStore = await this.storeRepository.save(store);
    const { password, ...result } = savedStore;
    return result;
  }
}
