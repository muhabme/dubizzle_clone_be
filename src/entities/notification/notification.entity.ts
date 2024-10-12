import { Entity, ManyToOne, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseModel } from '../../lib/entities/base.entity';

@Entity({ name: 'notifications' })
export class Notification extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  read: boolean;
}
