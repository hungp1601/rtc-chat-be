import { Injectable, Global } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Global()
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
