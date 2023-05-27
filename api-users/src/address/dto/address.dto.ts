import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  street: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  subdivision: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  region: string;
}
