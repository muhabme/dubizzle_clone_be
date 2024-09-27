import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

/**
 * Module for managing real-time notifications.
 */
@Module({
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
