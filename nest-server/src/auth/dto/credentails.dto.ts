import { IsString } from 'class-validator';

export class Credentails {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
