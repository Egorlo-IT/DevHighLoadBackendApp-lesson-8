import { IsNotEmpty, IsString } from 'class-validator';
export class ChatIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
