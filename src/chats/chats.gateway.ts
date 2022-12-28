import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.emit('hello_user', `hello_${username}`);
    // socket.id
    return 'hello world';
  }
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('constructor');
  }
  afterInit() {
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    // nsp : namespace
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected`);
  }
}
