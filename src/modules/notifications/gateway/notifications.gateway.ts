import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

/**
 * WebSocket gateway for real-time notifications.
 */
@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // Send notifications to clients
  notifyUsers(notification: string) {
    this.server.emit('notification', notification);
  }

  @SubscribeMessage('clientNotification')
  handleNotification(client: any, payload: any): void {
    this.server.emit('serverNotification', payload);
  }
}
