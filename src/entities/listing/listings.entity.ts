import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'listings' })
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

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
 
  
  @OneToOne(() => Promotion, (promotion) => promotion.listings)
  promotion: Promotion;

  @ManyToOne(() => User, (user) => user.listings)
  owner: User;
}
