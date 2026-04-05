import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
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