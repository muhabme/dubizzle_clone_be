import { BaseModel } from 'src/lib/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Listing } from './listings.entity';

@Entity({ name: 'promotions' })
export class Promotion extends BaseModel {
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
