import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Conversation } from './conversation.entity';

@Entity()
export class Message extends BaseModel {
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}
