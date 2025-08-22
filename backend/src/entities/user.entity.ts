import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Rating } from './rating.entity';

export enum UserRole {
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
  STORE_OWNER = 'store_owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 400 })
  address: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.NORMAL_USER,
  })
  role: UserRole;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[];

  @OneToMany(() => Rating, rating => rating.store)
  receivedRatings: Rating[];
}
