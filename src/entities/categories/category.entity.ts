import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
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

  @Column({ type: 'bigint', nullable: true })
  parent_id: number | null;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'parent_id',
    referencedColumnName: 'id',
  })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({
    type: 'datetime',
    nullable: true,
  })
  featured_at?: Date | null;

  isRootParent: boolean;
  hasChildren: boolean;
  isFeatured: boolean;

  @AfterLoad()
  computeValues() {
    this.isRootParent = !this.parent;
    this.isFeatured = !!this.featured_at;
    this.hasChildren = this.children && this.children.length > 0;
  }
}
