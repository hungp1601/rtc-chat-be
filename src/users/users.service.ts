import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from './users.entity';
import { UserDto } from './dtos/users.dto';
import { PaginationPayload } from 'src/shared/dtos/pagnation.dto';
import { UserListResponse } from './dtos/user-list-response.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }

  async showById(id: number): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await User.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await User.findOne({
        where: {
          username: username,
        },
      });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByResetToken(token: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { resetToken: token } });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(user: User): Promise<User> {
    try {
      const user_response = await User.save(user);
      if (!user_response) {
        throw new NotFoundException();
      }
      delete user_response.password;
      return user_response;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async me(id: number) {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
