import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from '../listing/listings.entity';


@Entity({ name: 'promotions' })
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.promotions, { onDelete: 'CASCADE' })
  listing: Listing;

  @Column({ type: 'varchar', length: 50 })
  type: string;
  
  @CreateDateColumn()
  promotedAt: Date;

  @Column({ type: 'int' })
  durationInDays: number;
}
