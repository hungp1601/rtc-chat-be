import { Injectable, NotFoundException } from '@nestjs/common';
import { Address } from 'src/address/address.entity';
import { Client } from './entities/client.entity';
import { ClientDto } from './dto/client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  async getAllClients(): Promise<Client[]> {
    let clients = await Client.find({ relations: ['address'] });
    clients = clients.map((client: Client) => {
      delete client.password;
      return client;
    });
    return clients;
  }

  async getClientById(id: number) {
    const client = await this.findById(id);
    delete client.password;
    return client;
  }

  async create(clientDto: ClientDto): Promise<Client> {
    const clientAddress = Address.create({
      street: clientDto.street,
      subdivision: clientDto.subdivision,
      region: clientDto.region,
    });
    await clientAddress.save();
    const client = Client.create({ ...clientDto, address: clientAddress });
    await client.save();
    delete client.password;
    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);

    // find the address to update
    const address = await Address.findOne(client.address.id);
    address.street = updateClientDto.street;
    address.subdivision = updateClientDto.subdivision;
    address.region = updateClientDto.region;
    await address.save();

    // update the client
    client.fullname = updateClientDto.fullname;
    client.email = updateClientDto.email;
    client.phone = updateClientDto.phone;
    client.validated = updateClientDto.validated;
    await client.save();
    return await this.findById(id);
  }

  private async findById(id: number): Promise<Client> {
    // find the client to get the address id
    const client = await Client.findOne(id, { relations: ['address'] });

    // if user was not found, then throw a not found exception
    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async delete(id: number): Promise<{ message: string }> {
    const client = await this.findById(id);
    await Client.delete(client);
    return {
      message: 'Client deleted',
    };
  }
}
