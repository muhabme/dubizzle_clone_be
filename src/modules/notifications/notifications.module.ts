import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

import { UsersModule } from '../users/users.module';
import { NotificationsGateway } from './gateway/notifications.gateway';

@Module({
  imports: [UsersModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
