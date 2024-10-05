import { Entity, Column } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';


@Entity({ name: 'categories' })
export class Category extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;
}
