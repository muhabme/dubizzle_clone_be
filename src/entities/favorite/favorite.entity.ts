import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listing/listings.entity';

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.favorites, { onDelete: 'CASCADE' })
  listing: Listing;

  @CreateDateColumn()
  favoritedAt: Date;
}
