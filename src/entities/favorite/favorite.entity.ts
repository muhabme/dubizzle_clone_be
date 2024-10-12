import { Entity, ManyToOne, CreateDateColumn } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Listing } from '../listing/listings.entity';

@Entity({ name: 'favorites' })
export class Favorite extends BaseModel {
  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.favorites, { onDelete: 'CASCADE' })
  listing: Listing;

  @CreateDateColumn()
  favoritedAt: Date;
}
