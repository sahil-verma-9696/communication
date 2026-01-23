import { IsOptional, IsString } from 'class-validator';
import { User } from '../schema/users.schema';

export class CreateUserDto implements Omit<User, 'passwordHash'> {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsOptional()
  verified_email: boolean;
}
