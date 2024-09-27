import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity representing a listing category.
 */
@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;
}
