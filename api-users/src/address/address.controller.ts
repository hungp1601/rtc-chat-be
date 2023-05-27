import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  index() {
    return this.addressService.getAllAddress();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.addressService.getById(Number(id));
  }

  @Post()
  create(@Body() addressDto: AddressDto) {
    return this.addressService.create(addressDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() addressDto: AddressDto) {
    return this.addressService.update(Number(id), addressDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.addressService.delete(Number(id));
  }
}
