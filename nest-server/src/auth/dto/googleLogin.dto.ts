import { IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  @IsNotEmpty({ message: 'code is required' })
  code: string;
}
