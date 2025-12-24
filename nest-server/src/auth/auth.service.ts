import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Credentails } from './dto/credentails.dto';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { jwtExpiresInToMs } from 'src/utilities/jwtExpiresToMs';
import { JwtPayload } from './auth.guard';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async register(user: CreateUserDto): Promise<AuthResponse> {
    const newUser = await this.usersService.create(user);

    if (!newUser) {
      throw new Error('User creation failed');
    }

    const payload = {
      sub: newUser._id.toString(),
      username: newUser.name,
      email: user.email,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const access_token = await this.jwtService.signAsync(payload);

    if (!access_token) {
      throw new Error('Token creation failed');
    }

    const expiresInMs = jwtExpiresInToMs('7d');

    const response: AuthResponse = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      token: access_token,
      user: newUser,
      expiresIn: String(expiresInMs),
    };

    return response;
  }

  async login(credentials: Credentails): Promise<AuthResponse> {
    const user = await this.usersService.getUserByEmail(credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await this.usersService.verfiyPassword(
      user._id.toString(),
      credentials.password,
    );

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.name,
      email: user.email,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const access_token = await this.jwtService.signAsync(payload);

    if (!access_token) {
      throw new Error('Token creation failed');
    }

    const expiresInMs = jwtExpiresInToMs('7d');

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      token: access_token,
      user,
      expiresIn: String(expiresInMs),
    };
  }

  logout() {
    return `This action returns a auth`;
  }

  async me(jwtUser: JwtPayload) {
    const user = await this.usersService.findOne(jwtUser.sub);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
