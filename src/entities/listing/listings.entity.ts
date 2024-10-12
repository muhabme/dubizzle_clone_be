import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Review } from '../reviews-ratings/review.entity';
import { Favorite } from '../favorite/favorite.entity';

@Entity({ name: 'listings' })
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  promoted: boolean;

  @ManyToOne(() => User, (user) => user.listings)
  owner: User;

  @OneToMany(() => Review, (review) => review.listing, { nullable: true })
  reviews?: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.listing)
  favorites: Favorite[];
}
