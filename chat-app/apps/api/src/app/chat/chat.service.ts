import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>
  ) {}

  async create(chat: ChatEntity): Promise<boolean | HttpException> {
    await this.chatRepository.save(chat);
    return true;
  }

  async findAll(): Promise<{ chat: ChatEntity[] }> {
    const data = await this.chatRepository.find();
    return { chat: data };
  }

  async edit(chat: ChatEntity, idChat: number) {
    const data = await this.chatRepository.update(idChat, chat);
    return data;
  }

  async findById(id: string): Promise<ChatEntity> {
    console.log('id:', id);
    const data = await this.chatRepository.findOneById(id);
    console.log('data:', data);

    return data;
  }

  async remove(id: string) {
    const _chat = await this.findById(id);
    if (_chat) {
      await this.chatRepository.remove(_chat);
      return true;
    }
    return false;
  }
}
