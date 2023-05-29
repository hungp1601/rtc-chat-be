import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async test() {
    return 'Hello';
  }
}
