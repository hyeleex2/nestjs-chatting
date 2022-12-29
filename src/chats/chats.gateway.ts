import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Chatting } from './models/chattings.model';
import { Socket as SocketModel } from './models/sockets.model';

@WebSocketGateway({ namespace: 'chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name)
    private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketModel: Model<SocketModel>,
  ) {
    this.logger.log('constructor');
  }

  afterInit() {
    this.logger.log('init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    // nsp : namespace
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected`);
    // db에서 삭제
    const user = await this.socketModel.findOne({
      id: socket.id,
    });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // username을 db에 적재
    // sockets.model에 username 중복 체크
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
    }
    await this.socketModel.create({
      id: socket.id,
      username,
    });

    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.socketModel.findOne({
      id: socket.id,
    });
    await this.chattingModel.create({
      user,
      chat,
    });
    socket.broadcast.emit('user_chat', {
      chat,
      username: user.username,
    });
  }
}
