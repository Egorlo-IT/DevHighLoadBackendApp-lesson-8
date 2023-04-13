import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class MessageCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Message', description: 'Message' })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'User id', description: 'User id' })
  userId: string;
}
