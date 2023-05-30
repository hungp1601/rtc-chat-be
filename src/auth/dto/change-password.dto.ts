import { IsNotEmpty, Length, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(8, 24)
  @IsNotEmpty()
  password: string;
}
