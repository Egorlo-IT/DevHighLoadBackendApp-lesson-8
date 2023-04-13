import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ObjectIdColumn,
} from 'typeorm';
import { ChatEntity } from '../chat/chat.entity';
import { MessageEntity } from '../chat/message/message.entity';
import { Role } from '../auth/role/role.enum';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersEntity {
  @ObjectIdColumn()
  @ApiProperty({ example: 'User id', description: 'User id' })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'User first name', description: 'User first name' })
  firstName: string;

  @Column('text')
  @ApiProperty({
    example: 'User last name',
    description: 'User last name',
  })
  lastName: string;

  @Column('text')
  @ApiProperty({
    example: 'User email',
    description: 'User email',
  })
  email: string;

  @Column('text')
  @ApiProperty({
    example: 'User password',
    description: 'User password',
  })
  password: string;

  @Column('text')
  @IsEnum(Role)
  @ApiProperty({
    example: 'User role',
    description: 'User role',
  })
  roles: Role;

  @OneToMany(() => ChatEntity, (chat) => chat.user)
  chat: ChatEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  message: MessageEntity[];

  @Column('text', { nullable: true })
  @ApiProperty({
    example: 'User avatar',
    description: 'User avatar',
  })
  avatar: string;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date create user',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    description: 'Date update user',
  })
  updatedAt: Date;
}
