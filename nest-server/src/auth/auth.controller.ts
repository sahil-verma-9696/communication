import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Credentails } from './dto/credentails.dto';
import * as authGuard from './auth.guard';
import { GoogleStrategy } from './google.strategy';
import type { Response } from 'express';
import { RequestBodyDto } from './dto/request-body';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleStrategy: GoogleStrategy,
  ) {}

  /**
   * User Registration
   * ------------------
   *
   * @description Register a new user
   *
   * @param user
   * @returns
   */
  @Post('register')
  registerUser(@Body() user: RequestBodyDto) {
    return this.authService.register(user);
  }

  /**
   * POST : Local User Login
   * ---------------
   * @param credentials
   * @returns
   */
  @Post('login')
  loginUser(@Body() credentials: Credentails) {
    return this.authService.login(credentials);
  }

  /**
   * GET : OAuth Logins
   * -------------------
   * @param res
   * @param {{ code: string }} query
   * @returns
   */
  @Get('login')
  handleGoogleLogin(@Res() res: Response) {
    return this.googleStrategy.getConsent(res);
  }

  @Get('google/oauth2callback')
  handleGoogleRedirect(@Query() query: { code: string }) {
    return this.googleStrategy.validate({
      auth_code: query.code,
    });
  }

  // ---------- NEW (mobile) ----------
  @Post('google/mobile')
  googleMobileLogin(@Body('idToken') idToken: string) {
    return this.googleStrategy.googleMobileLogin(idToken);
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
