import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { Listing } from './listings.entity';

@Entity({ name: 'promotions' })
export class Promotion extends BaseModel {
  @OneToOne(() => Listing, (listing) => listing.promotion)
  @JoinColumn()
  listing: Listing;

  @Column({ type: 'varchar', length: 100 })
  promotionType: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;
}
