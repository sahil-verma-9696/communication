import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsString({ message: 'description must be a string' })
  description: string;

  @IsString({ message: 'avatar url must be a string' })
  avatar: string;

  @IsString({ each: true, message: 'participants must be an array of strings' })
  participants: string[];
}
