import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Store, Rating],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
    DashboardModule,
  ],
})
export class AppModule {}
