import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @Length(10)
  @IsOptional()
  phone: string;

  @IsBoolean()
  @IsOptional()
  validated: null;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  subdivision: string;

  @IsString()
  @IsOptional()
  region: string;
}
