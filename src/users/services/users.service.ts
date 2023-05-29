import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserDto } from '../dtos/users.dto';
import { PaginationPayload } from 'src/shared/dtos/pagnation.dto';

@Injectable()
export class UsersService {
  async create(userDto: UserDto): Promise<User> {
    try {
      const user = User.create(userDto);
      await user.save();
      delete user.password;
      return user;
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllUsers(
    paginationPayload: PaginationPayload,
  ): Promise<{ users: User[]; total: number }> {
    const { page = 1, pageSize = 10 } = paginationPayload;

    const skip = (page - 1) * pageSize;

    const [users, total] = await User.findAndCount({
      skip,
      take: pageSize,
    });

    const sanitizedUsers = users.map((user: User) => {
      delete user.password;
      return user;
    });

    return {
      users: sanitizedUsers,
      total,
    };
  }

  async showById(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    delete user.password;
    return user;
  }

  async findById(id: number): Promise<User> {
    return await User.findOne(id);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByResetToken(token: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { resetToken: token } });
      if (!user) {
        throw new NotFoundException();
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
    }
  }
}
