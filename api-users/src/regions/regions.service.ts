import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    try {
      const region = Region.create(createRegionDto);
      await region.save();
      return region;
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException(`That region already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll(): Promise<Region[]> {
    const regions = await Region.find();
    return regions;
  }

  async findOne(id: number): Promise<Region> {
    return await this.findById(id);
  }

  async update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region> {
    try {
      const region = await this.findById(id);
      region.name = updateRegionDto.name;
      await region.save();
      return region;
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException(`That region already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findById(id: number): Promise<Region> {
    const region = await Region.findOne(id);
    if (!region) {
      throw new NotFoundException(`Region not found`);
    }
    return region;
  }
}
