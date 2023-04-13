/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsJwtGuard } from '../../auth/ws-jwt.guard';
import { MessageService } from './message.service';
import { OnEvent } from '@nestjs/event-emitter';
import Redis from 'ioredis';

export type Message = {
  message?: string;
  idChat?: string;
  idMessage?: string;
  chatCurrTitle?: string;
  chatCurrCreatedAt?: string;
};

@WebSocketGateway({ cors: true })
export class SocketMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private redis = new Redis();
  private DEFAULT_EXPIRAION = 3600;
  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('getMessage')
  async getMessage(client: Socket, mess: Message): Promise<void> {
    const { idChat, chatCurrTitle, chatCurrCreatedAt } = mess;

    this.redis.get(idChat.toString(), async (error, messages) => {
      if (error) console.error(error);
      if (messages !== null) {
        // console.log('redis db !== null');
        this.server
          .to(idChat.toString())
          .emit('refreshMessage', JSON.parse(messages));
      } else {
        // console.log('redis db null');
        const _messages = (await this.messageService.findAll()).filter(
          (item) =>
            item.chat.title === chatCurrTitle &&
            item.chat.createdAt.toString() ===
              new Date(chatCurrCreatedAt).toString()
        );

        const messageData = await JSON.parse(
          JSON.stringify(_messages),
          function (key, value) {
            if (key == 'password' || key == 'email') return;
            return value;
          }
        );

        this.redis.set(
          idChat.toString(),
          JSON.stringify(messageData),
          'EX',
          this.DEFAULT_EXPIRAION
        );

        this.server.to(idChat.toString()).emit('refreshMessage', messageData);
      }
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addMessage')
  async handleMessage(client: Socket, mess: Message): Promise<void> {
    const { idChat, message } = mess;
    const userId: string = client.data.user.id;

    await this.messageService.create(idChat, message, userId);

    await this.redis.get(idChat.toString(), async (error, messages) => {
      if (error) console.error(error);
      if (messages !== null) {
        this.redis.del(idChat.toString(), (err, response) => {
          if (response == 1) {
            console.log(`Key ${idChat} deleted Successfully!`);
          } else {
            console.log(`Key ${idChat} cannot delete. Error: ${err}`);
          }
        });
      }
    });

    this.server.to(idChat.toString()).emit('newMessage');
  }

  @OnEvent('message.remove')
  handleRemoveMessageEvent(payload): void {
    const { idMessage, idChat } = payload;
    this.server.to(idChat.toString()).emit('removeMessage', { idMessage });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): void {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const { chatId } = client.handshake.query;

    // После подключения пользователя к веб-сокету, подключаем его в комнату
    client.join(chatId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
