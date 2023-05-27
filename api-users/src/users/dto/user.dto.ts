import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @Length(8, 24)
  @IsNotEmpty()
  password: string;
}
