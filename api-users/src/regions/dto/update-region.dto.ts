import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {
  @IsString()
  name: string;
}
