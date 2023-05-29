import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { UserDto } from '../dtos/users.dto';
import { PaginationPayload } from 'src/shared/dtos/pagnation.dto';

import { User } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getAllUsers(
    @Query() paginationPayload: PaginationPayload,
  ): Promise<{ users: User[]; total: number }> {
    return this.usersService.getAllUsers(paginationPayload);
  }

  @Get(':id')
  showById(@Param('id') id: string): Promise<User> {
    return this.usersService.showById(Number(id));
  }

  @ApiBody({
    type: UserDto,
    schema: {
      example: {
        fullname: 'fullname',
        username: 'test@example.com',
        password: 'password123',
      },
    },
  })
  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.usersService.create(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me() {
    return 'Hello';
  }
}
