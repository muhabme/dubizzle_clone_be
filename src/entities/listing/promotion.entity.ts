import { Entity, Column, OneToOne, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Listing } from './listings.entity';
import { BaseModel } from 'src/lib/entities/base.entity';

@Entity({ name: 'promotions' })
export class Promotion extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Listing, (listing) => listing.id)
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
