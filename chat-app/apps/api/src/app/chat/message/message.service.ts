import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { MongoRepository } from 'typeorm';
import { ChatService } from '../chat.service';
import { MessageEntity } from './message.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: MongoRepository<MessageEntity>,
    private readonly userService: UsersService,
    private readonly chatService: ChatService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async findAll(): Promise<MessageEntity[]> {
    const data = await this.messageRepository.find();
    return data;
  }

  async create(
    idChat: string,
    message: string,
    userId: string
  ): Promise<MessageEntity | HttpException> {
    const _chat = await this.chatService.findById(idChat);
    const _user = await this.userService.findById(userId);
    if (!_chat || !_user) {
      throw new HttpException(
        'Не существует такой новости или пользователя',
        HttpStatus.BAD_REQUEST
      );
    }
    const _messageEntity = new MessageEntity();
    _messageEntity.message = message;
    _messageEntity.chat = _chat;
    _messageEntity.user = _user;
    await this.messageRepository.save(_messageEntity);
    return _messageEntity;
  }

  async edit(
    idMessage: string,
    idChat: string,
    message: string,
    userId: string
  ): Promise<MessageEntity> {
    const _chat = await this.chatService.findById(idChat);
    const _user = await this.userService.findById(userId);
    if (!_chat || !_user) {
      throw new HttpException(
        'Не существует такого чата или пользователя',
        HttpStatus.BAD_REQUEST
      );
    }
    const _messageEntity = new MessageEntity();
    _messageEntity.message = message;
    _messageEntity.chat = _chat;
    _messageEntity.user = _user;
    await this.messageRepository.update(idMessage, _messageEntity);
    return _messageEntity;
  }
}
