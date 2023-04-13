import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { MessageService } from './message/message.service';
import { ChatCreateDto } from './dtos/chat-create.dto';
import { ChatEntity } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chat')
@ApiBearerAuth()
@ApiTags('Chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private usersService: UsersService,
    private readonly messageService: MessageService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all chat' })
  @ApiResponse({
    status: 200,
    description: 'Chat successfully received',
    type: ChatEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getAll(): Promise<{ chat: ChatEntity[] }> {
    const chat = await this.chatService.findAll();
    const data = JSON.parse(JSON.stringify(chat), function (key, value) {
      if (key == 'password' || key == 'email') return;
      return value;
    });

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Chat creation' })
  @ApiResponse({
    status: 200,
    description: 'Chat successfully created',
    type: ChatEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async create(@Body() chat: ChatCreateDto) {
    try {
      console.log('chat:', chat);

      const _user = await this.usersService.findById(chat.authorId);
      if (!_user) {
        throw new HttpException(
          'Не существует такого автора',
          HttpStatus.BAD_REQUEST
        );
      }

      const _chatEntity = new ChatEntity();
      _chatEntity.title = chat.title;
      _chatEntity.user = _user;

      const _chat = await this.chatService.create(_chatEntity);
      return _chat;
    } catch (error) {
      console.log(error);
    }
  }
}
