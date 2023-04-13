import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { SocketMessageGateway } from './socket-message.gateway';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { ChatModule } from '../chat.module';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { ChatEntity } from '../chat.entity';

@Module({
  providers: [MessageService, SocketMessageGateway],
  controllers: [MessageController],
  imports: [
    forwardRef(() => ChatModule),
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([MessageEntity, ChatEntity]),
  ],
  exports: [MessageService],
})
export class MessageModule {}
