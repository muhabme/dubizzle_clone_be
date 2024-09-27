import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';

/**
 * Module for managing buyer-seller messaging.
 */
@Module({
  providers: [MessagingGateway],
})
export class MessagingModule {}
