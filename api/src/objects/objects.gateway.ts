import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class ObjectsGateway {
  @WebSocketServer()
  server!: Server;

  notifyNewObject(object: any) {
    this.server.emit('new-object', object);
  }

  notifyDeletedObject(id: string) {
    this.server.emit('deleted-object', id);
  }
}