import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { username, password } = authLoginDto;

    const user = await this.usersService.findByUsername(username);
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
