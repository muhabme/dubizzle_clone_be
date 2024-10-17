import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { Listing } from '../listing/listings.entity';

@Entity({ name: 'categories' })
export class Category extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => Listing, (listing) => listing.category)
  listings: Listing[];
}
