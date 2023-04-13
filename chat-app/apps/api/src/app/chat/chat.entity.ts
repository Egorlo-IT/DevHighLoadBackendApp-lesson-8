import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ObjectIdColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { MessageEntity } from './message/message.entity';

@Entity('chat')
export class ChatEntity {
  @ObjectIdColumn()
  @ApiProperty({ example: 'Chat id', description: 'Chat id' })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'Chat title', description: 'Chat title' })
  title: string;

  @Column(() => UsersEntity)
  @ManyToOne(() => UsersEntity, (user) => user.chat)
  user: UsersEntity;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  @ApiProperty({
    example: 'Array entities MessageEntity',
    description: 'Array entities MessageEntity',
  })
  message: MessageEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date create chat',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date update chat',
  })
  updatedAt: Date;
}
