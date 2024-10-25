import { IAttachment } from 'src/lib/types/attachment';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { Category } from '../categories/category.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Review } from '../reviews-ratings/review.entity';
import { User } from '../users/user.entity';
import { Promotion } from './promotion.entity';

@Entity({ name: 'listings' })
export class Listing extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  category_uuid: string;

  @ManyToOne(() => Category, (category) => category.listings)
  @JoinColumn({ name: 'category_uuid', referencedColumnName: 'uuid' })
  category: Category;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'json', nullable: true })
  images?: IAttachment[];

  @OneToOne(() => Promotion, (promotion) => promotion.listing)
  promotion: Promotion;

  @ManyToOne(() => User, (user) => user.listings)
  owner: User;

  @OneToMany(() => Review, (review) => review.listing, { nullable: true })
  reviews?: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.listing)
  favorites: Favorite[];

  @OneToMany(() => Promotion, (promotion) => promotion.listing)
  promotions: Promotion[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_after_sale: number;

  @Column({ type: 'datetime', nullable: true })
  featured_at: Date;

  is_on_sale: boolean;
  is_featured: boolean;

  @AfterInsert()
  @AfterUpdate()
  @AfterLoad()
  computeValues() {
    this.is_on_sale = !!this.price_after_sale;
    this.is_featured = !!this.featured_at;
  }
}
