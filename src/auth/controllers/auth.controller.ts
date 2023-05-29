import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: AuthLoginDto,
    schema: {
      example: { username: 'test@example.com', password: 'password123' },
    },
  })
  @Post()
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async test() {
    return 'Hello';
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('forgot-password')
  // async forgotPassword(
  //   @Body() forgotPasswordDto: ForgotPasswordDto,
  // ): Promise<void> {
  //   return this.authService.forgotPassword(forgotPasswordDto);
  // }
}
