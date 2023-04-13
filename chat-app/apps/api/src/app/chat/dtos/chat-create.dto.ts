import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class ChatCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Chat title', description: 'Chat title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Author id', description: 'Author id' })
  authorId: string;
}
