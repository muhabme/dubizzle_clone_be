import { Entity, Column, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listings.entity';
import { BaseModel } from 'src/lib/entities/base.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'promotions' })
export class Promotion extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Listing, (listing) => listing.promotion)
  @JoinColumn()
  listing: Listing;

  @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  promotionType: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;
}
