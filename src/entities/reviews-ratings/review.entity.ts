// src/entities/reviews-ratings/review.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Listing } from '../listing/listings.entity';

@Entity({ name: 'reviews' })
export class Review extends BaseModel {
  @ManyToOne(() => User, (user) => user.reviewsGiven)
  reviewer: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived, { nullable: true })
  reviewee?: User;

  @ManyToOne(() => Listing, (listing) => listing.reviews, { nullable: true })
  listing?: Listing;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;
}
