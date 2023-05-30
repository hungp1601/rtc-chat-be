import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { UserDto } from '../dtos/users.dto';
import { PaginationPayload } from 'src/shared/dtos/pagnation.dto';

import { User } from '../entities/users.entity';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserListResponse } from '../dtos/user-list-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(
    @Query() paginationPayload: PaginationPayload,
  ): Promise<UserListResponse> {
    return this.usersService.getAllUsers(paginationPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return this.usersService.me(req.user.UserId);
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
}
