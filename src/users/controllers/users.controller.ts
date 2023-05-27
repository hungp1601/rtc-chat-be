import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from '../dtos/users.dto';
import { User } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  index(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  show(@Param('id') id: string): Promise<User> {
    return this.usersService.showById(Number(id));
  }

  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.usersService.create(userDto);
  }
}
