import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsString({ message: 'avatar must be a string' })
  @IsOptional()
  avatar?: string;

  @IsBoolean({ message: 'isEmailVerified must be a boolean' })
  @IsOptional()
  isEmailVerified?: boolean;
}
