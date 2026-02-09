import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'email must be a string' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'avatar must be a string' })
  @IsOptional()
  avatar?: string;
}
