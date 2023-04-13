import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ObjectIdColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { ChatEntity } from '../chat.entity';

@Entity('message')
export class MessageEntity {
  @ObjectIdColumn()
  @ApiProperty({ example: 'Message id', description: 'Message id' })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'Message message', description: 'Message message' })
  message: string;

  @Column(() => UsersEntity)
  @ManyToOne(() => UsersEntity, (user) => user.message)
  user: UsersEntity;

  @Column(() => ChatEntity)
  @ManyToOne(() => ChatEntity, (chat) => chat.message)
  chat: ChatEntity;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date create message',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date update message',
  })
  updatedAt: Date;
}
