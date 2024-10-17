import { BaseModel } from 'src/lib/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'payments' })
export class Payment extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  provider: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 100 })
  status: string;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
