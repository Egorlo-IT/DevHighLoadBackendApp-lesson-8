import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageCreateDto } from './dtos/message-create.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common/pipes';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MessageEntity } from './message.entity';

@Controller('chat-message')
@ApiBearerAuth()
@ApiTags('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create/:idChat')
  @ApiOperation({ summary: 'Message creation' })
  @ApiResponse({
    status: 200,
    description: 'Message successfully created',
    type: MessageEntity,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  create(
    @Param('idChat', ParseIntPipe) idChat: string,
    @Body() message: MessageCreateDto
  ) {
    return this.messageService.create(idChat, message.message, message.userId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all messages' })
  @ApiResponse({
    status: 200,
    description: 'Messages successfully received',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: Error,
  })
  async getAll() {
    const messageData = await this.messageService.findAll();
    const message = JSON.parse(
      JSON.stringify(messageData),
      function (key, value) {
        if (key == 'password' || key == 'email') return;
        return value;
      }
    );
    return message;
  }
}
