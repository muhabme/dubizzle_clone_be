import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

/**
 * WebSocket gateway for real-time buyer-seller messaging.
 */
@WebSocketGateway()
export class MessagingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('messageToServer')
  handleMessage(client: any, payload: any): void {
    this.server.emit('messageToClient', payload);
  }
}
