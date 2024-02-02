import { IsString, MinLength } from 'class-validator';

export class AuthRegisterDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
