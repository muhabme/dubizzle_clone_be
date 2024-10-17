import { Module } from '@nestjs/common';
import { MessagingController } from './controllers/messaging.controller';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './services/messaging.service';

@Module({
  controllers: [MessagingController],
  providers: [MessagingGateway, MessagingService],
})
export class MessagingModule {}
