import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(8, 24)
  @IsNotEmpty()
  password: string;
}
