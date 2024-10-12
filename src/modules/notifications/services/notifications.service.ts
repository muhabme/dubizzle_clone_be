import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../../entities/notification/notification.entity';
import { User } from 'src/entities/users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(user: User, content: string): Promise<Notification> {
    const notification = this.notificationRepository.create({ user, content });
    return await this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id: notificationId } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.read = true;
    return await this.notificationRepository.save(notification);
  }
}
