import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDto } from './dto/client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  index() {
    return this.clientsService.getAllClients();
  }

  @Get(':id')
  show(@Param('id') id: string) {
    return this.clientsService.getClientById(Number(id));
  }

  @Post()
  create(@Body() clientDto: ClientDto) {
    return this.clientsService.create(clientDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(Number(id), updateClientDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientsService.delete(Number(id));
  }
}
