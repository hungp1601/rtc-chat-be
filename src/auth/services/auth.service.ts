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
import { ChangePasswordDto } from '../dto/change-password.dto';
import * as nodemailer from 'nodemailer';

import { User } from 'src/users/entities/users.entity';
import * as bcrypt from 'bcryptjs';

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

  async changePassword(token: string, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.usersService.findByResetToken(token);
      user.password = await bcrypt.hash(changePasswordDto.password, 8);
      user.resetToken = null;
      user.resetTokenExpiration = null;

      await user.save();
      delete user.password;
      return user;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const { username } = forgotPasswordDto;
      const user = await this.usersService.findByUsername(username);

      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = this.generateResetToken();
      const resetTokenExpiration = this.generateResetTokenExpiration(60);

      await this.updateUserResetToken(user, resetToken, resetTokenExpiration);
      await this.sendResetPasswordEmail(user, resetToken);
      return {
        message: 'Email sent',
      };
    } catch (err) {
      throw new BadRequestException();
    }
  }

  generateResetToken(): string {
    const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?:{},./[]`;
    let token = '';
    const length = 20;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }

    return token;
  }

  private generateResetTokenExpiration(minute: number): Date {
    return new Date(Date.now() + minute * 60 * 1000);
  }

  private async updateUserResetToken(
    user: User,
    resetToken: string,
    resetTokenExpiration: Date,
  ): Promise<void> {
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await this.usersService.update(user);
  }

  private async sendResetPasswordEmail(
    user: User,
    resetToken: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const http = `http://${process.env.BASE_URL}:${process.env.PORT}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.username,
      subject: 'Password Reset',
      text: `Please click the following link to reset your password: 
      ${http}`,
    });
  }
}
