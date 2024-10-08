import { Controller, Get, Patch, Param, Req } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { Request } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Req() req: Request) {
    const userId = (req.user as any).id;
    return await this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number) {
    return await this.notificationsService.markAsRead(id);
  }
}
