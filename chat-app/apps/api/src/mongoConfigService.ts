import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { MessageEntity } from './app/chat/message/message.entity';
import { ChatEntity } from './app/chat/chat.entity';
import { UsersEntity } from './app/users/users.entity';

@Injectable()
export class MongoConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      database: 'chat',
      synchronize: true,
      logging: ['query', 'error'],
      entities: [UsersEntity, ChatEntity, MessageEntity],
      migrations: [],
      subscribers: [],
      useUnifiedTopology: true,
    };
  }
}
