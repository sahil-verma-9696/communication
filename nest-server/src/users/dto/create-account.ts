import { IsBoolean, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAccountDto {
  @IsMongoId({ message: 'user must be a valid mongo id' })
  user: Types.ObjectId;

  @IsString({ message: 'passwordHash must be a string' })
  passwordHash: string;

  @IsBoolean({ message: 'isEmailVerified must be a boolean' })
  isEmailVerified?: boolean;
}
