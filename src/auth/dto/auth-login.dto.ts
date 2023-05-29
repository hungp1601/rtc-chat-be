import { IsNotEmpty, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
