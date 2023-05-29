import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import * as nodemailer from 'nodemailer';

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

    try {
      const user = await this.usersService.findByUsername(username);

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException('Not found this user');
      } else {
        throw new BadRequestException();
      }
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { username } = forgotPasswordDto;
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = generateResetToken();
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    // await this.userRepository.save(user);

    const transporter = nodemailer.createTransport({
      // Configure your SMTP details here
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your_email@example.com',
        pass: 'your_email_password',
      },
    });

    await transporter.sendMail({
      from: 'your_email@example.com',
      to: user.username,
      subject: 'Password Reset',
      text: `Please click the following link to reset your password: 
      http://localhost:3000/reset-password?token=${resetToken}`,
    });
  }
}

function generateResetToken(): string {
  // Implement your token generation logic here
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const length = 20;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
