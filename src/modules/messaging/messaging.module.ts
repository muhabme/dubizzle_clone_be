import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './services/messaging.service';
import { MessagingController } from './controllers/messaging.controller';
import { Conversation } from 'src/entities/messaging/conversation.entity';
import { Message } from 'src/entities/messaging/message.entity';
import { User } from 'src/entities/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, User])],
  controllers: [MessagingController],
  providers: [MessagingGateway, MessagingService],
})
export class MessagingModule {}
