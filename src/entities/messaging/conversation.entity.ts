import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseModel } from '../../lib/entities/base.entity';
import { User } from '../users/user.entity';
import { Message } from './message.entity';

@Entity()
export class Conversation extends BaseModel {
  @ManyToMany(() => User, (user) => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
