import { Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, Column } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
