import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

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

  async getAllUsers(): Promise<User[]> {
    let users = await User.find();
    users = users.map((user: User) => {
      delete user.password;
      return user;
    });
    return users;
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
}
