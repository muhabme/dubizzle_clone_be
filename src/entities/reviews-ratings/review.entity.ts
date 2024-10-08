import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listing/listings.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviewsWritten, { onDelete: 'CASCADE' })
  reviewer: User;

  @ManyToOne(() => User, (user) => user.reviewsReceived, { nullable: true, onDelete: 'CASCADE' })
  reviewee: User;

  @ManyToOne(() => Listing, (listing) => listing.reviews, { nullable: true, onDelete: 'CASCADE' })
  listing: Listing;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
