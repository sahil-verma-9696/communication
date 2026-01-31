import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsString({ message: 'email must be a string' })
  email: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
