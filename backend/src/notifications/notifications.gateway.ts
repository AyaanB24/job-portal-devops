import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.set(userId, client.id);
      console.log(`Client connected: ${userId} (${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedClients.entries()) {
      if (socketId === client.id) {
        this.connectedClients.delete(userId);
        console.log(`Client disconnected: ${userId}`);
        break;
      }
    }
  }

  // Notify everyone about a new job
  notifyNewJob(job: any) {
    this.server.emit('NEW_JOB', job);
  }

  // Notify specific user about application status change
  notifyApplicationStatus(userId: string, application: any) {
    const socketId = this.connectedClients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('APPLICATION_STATUS_UPDATE', application);
    }
  }

  // Notify employer about a new application
  notifyNewApplication(employerId: string, application: any) {
    const socketId = this.connectedClients.get(employerId);
    if (socketId) {
      this.server.to(socketId).emit('NEW_APPLICATION', application);
    }
  }
}
