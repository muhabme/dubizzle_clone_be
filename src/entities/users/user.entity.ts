import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AccessToken } from '../access-token/access-token.entity';
import { BaseAuthenticatableModel } from '../../lib/entities/authenticatable.entity';
import { AccessToken } from '../access-token/access-token.entity';
import { Listing } from '../listing/listings.entity';
import { Review } from '../reviews-ratings/review.entity';
import { Favorite } from '../favorite/favorite.entity';
import { Conversation } from '../messaging/conversation.entity';
import { Message } from '../messaging/message.entity';

@Entity({ name: 'users' })
export class User extends BaseAuthenticatableModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string; 

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', nullable: true })
  resetToken?: string;

  @OneToMany(() => AccessToken, (accessToken: AccessToken) => accessToken.user)
  access_tokens: AccessToken[];

  @OneToMany(() => Listing, (listing) => listing.owner)
  listings: Listing[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviewsGiven: Review[];

  @OneToMany(() => Review, (review) => review.reviewee, { nullable: true })
  reviewsReceived?: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Conversation, (conversation) => conversation.users)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
