import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { Conversation } from './conversation.entity';
import { User } from '../users/user.entity';

@Entity()
export class Message extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}
