import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'listings' })
export class Listing extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, (category) => category.listings)
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @OneToOne(() => Promotion, (promotion) => promotion.listing)
  promotion: Promotion;

  @ManyToOne(() => User, (user) => user.listings)
  owner: User;
}