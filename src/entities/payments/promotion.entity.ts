import { BaseModel } from 'src/lib/entities/base.entity';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { Listing } from '../listing/listings.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'promotions' })
export class Promotion extends BaseModel {
  @ManyToOne(() => User, (user) => user.promotions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Listing, (listing) => listing.promotions, {
    onDelete: 'CASCADE',
  })
  listing: Listing;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @CreateDateColumn()
  promotedAt: Date;

  @Column({ type: 'int' })
  durationInDays: number;
}
