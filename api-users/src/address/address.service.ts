import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressDto } from './dto/address.dto';
import { Address } from './address.entity';

@Injectable()
export class AddressService {
  async create(addressDto: AddressDto): Promise<Address> {
    const address = Address.create(addressDto);
    await address.save();
    return address;
  }

  async getAllAddress(): Promise<Address[]> {
    const addresses = await Address.find();
    return addresses;
  }

  async getById(id: number): Promise<Address> {
    const address = await Address.findOne(id);
    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }
    return address;
  }

  async update(id: number, addressDto: AddressDto): Promise<Address> {
    const address = await Address.findOne(id);
    address.street = addressDto.street;
    address.subdivision = addressDto.subdivision;
    address.region = addressDto.region;
    await address.save();
    return address;
  }

  async delete(id: number): Promise<void> {
    const address = await Address.findOne(id);
    if (!address) {
      throw new NotFoundException(`Address with ID "${id}" not found`);
    }
    await address.remove();
  }
}
