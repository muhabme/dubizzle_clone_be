import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/entities/messaging/conversation.entity';
import { Message } from 'src/entities/messaging/message.entity';
import { User } from 'src/entities/users/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    const user1 = await this.userRepository.findOne(user1Id);
    const user2 = await this.userRepository.findOne(user2Id);

    const conversation = this.conversationRepository.create({ user1, user2 });
    return await this.conversationRepository.save(conversation);
  }

  async createMessage(conversationId: number, senderId: number, content: string): Promise<Message> {
    const conversation = await this.conversationRepository.findOne(conversationId);
    const sender = await this.userRepository.findOne(senderId);

    const message = this.messageRepository.create({ conversation, sender, content });
    conversation.lastUpdated = new Date();
    await this.conversationRepository.save(conversation);

    return await this.messageRepository.save(message);
  }
}
