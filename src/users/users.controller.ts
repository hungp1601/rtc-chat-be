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
import { Crud, CrudController } from '@nestjsx/crud';

import { User } from './users.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Crud({
  model: {
    type: User,
  },
  // routes: {
  //   only: ['getManyBase', 'deleteOneBase', 'updateOneBase'],
  //   getManyBase: {
  //     decorators: [UseGuards(JwtAuthGuard)],
  //   },
  //   deleteOneBase: {
  //     decorators: [UseGuards(JwtAuthGuard)],
  //   },
  //   updateOneBase: {
  //     decorators: [UseGuards(JwtAuthGuard)],
  //   },
  // },
})
@ApiTags('Users')
@Controller('users')
export class UsersController implements CrudController<User> {
  service: UsersService;
  constructor(private readonly usersService: UsersService) {
    this.service = usersService;
  }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getAllUsers(
  //   @Query() paginationPayload: PaginationPayload,
  // ): Promise<UserListResponse> {
  //   return this.usersService.getAllUsers(paginationPayload);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return this.usersService.me(req.user.UserId);
  }

  @Get(':id')
  showById(@Param('id') id: string): Promise<User> {
    return this.usersService.showById(Number(id));
  }

  // @ApiBody({
  //   type: UserDto,
  //   schema: {
  //     example: {
  //       fullname: 'fullname',
  //       username: 'test@example.com',
  //       password: 'password123',
  //     },
  //   },
  // })
  // @Post()
  // createUser(@Body() userDto: UserDto) {
  //   return this.usersService.create(userDto);
  // }
}
