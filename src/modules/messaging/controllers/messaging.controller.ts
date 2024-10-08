
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessagingService } from '../services/messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('conversations')
  async createConversation(@Body() data: { user1Id: number, user2Id: number }) {
    return await this.messagingService.createConversation(data.user1Id, data.user2Id);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') conversationId: number) {
    return await this.messagingService.getMessages(conversationId);
  }
}
s