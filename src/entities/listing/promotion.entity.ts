import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Listing } from './listings.entity';

@Entity({ name: 'promotions' })
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, (listing) => listing.id)
  listing: Listing;

  @Column({ type: 'varchar', length: 100 })
  promotionType: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @OneToOne(() => Listing, (listing) => listing.promotion)
  listings: Listing[];
}

