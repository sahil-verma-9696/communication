import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentails } from './dto/credentails.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as authGuard from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  loginUser(@Body() credentials: Credentails) {
    return this.authService.login(credentials);
  }

  @Get('logout')
  logout() {
    return this.authService.logout();
  }

  @UseGuards(authGuard.AuthGuard)
  @Get('me')
  me(@Request() req: authGuard.AuthRequest) {
    return this.authService.me(req?.user);
  }
}
