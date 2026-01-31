import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Credentails } from './dto/credentails.dto';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.guard';
import { RequestBodyDto } from './dto/request-body';
import { LocalStrategy } from './local.strategy';
import { GoogleStrategy } from './google.strategy';
import { UsersRepo } from 'src/users/repos/users.repo';
import { AccountRepo } from 'src/users/repos/account.repo';
import { AccountLifecycleRepo } from 'src/users/repos/account_lifecycle.repo';
import { toEpoch } from 'src/utilities/toEpoch';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private readonly googleStrategy: GoogleStrategy,
    private readonly localStrategy: LocalStrategy,
    private readonly usersRepo: UsersRepo,
    private readonly accountsRepo: AccountRepo,
    private readonly accountLifecycleRepo: AccountLifecycleRepo,
  ) {}

  async register(user: RequestBodyDto): Promise<AuthResponse> {
    const newUser = await this.usersService.registerNewUser(user);

    if (!newUser)
      throw new InternalServerErrorException('User creation failed');

    /**
     * Create token
     * ------------
     */
    const access_token = await this.jwtService.signAsync({
      sub: newUser.userId,
      username: newUser.user.name,
      email: newUser.user.email,
      isEmailVerified: newUser.account.isEmailVerified,
      trialEndAt: toEpoch(newUser.accountLifecycle?.trialEndAt),
      accountDeleteAt: toEpoch(newUser.accountLifecycle?.accountDeletedAt),
    });

    return {
      token: access_token,
      user: newUser.user,
    };
  }

  async login(credentials: Credentails): Promise<AuthResponse> {
    const { email, password } = credentials;
    const { user, account } =
      (await this.localStrategy.validate(email, password)) || {};

    if (!user || !account) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accountLifecycle = await this.accountLifecycleRepo.findByAccountId(
      account._id,
    );

    const access_token = await this.jwtService.signAsync({
      sub: user._id.toString(),
      username: user.name,
      email: user.email,
      isEmailVerified: account.isEmailVerified,
      trialEndAt: toEpoch(accountLifecycle?.trialEndAt),
      accountDeleteAt: toEpoch(accountLifecycle?.accountDeletedAt),
    });

    return {
      token: access_token,
      user,
    };
  }

  async googleLogin(code: string): Promise<AuthResponse> {
    // 1. Get Google user info
    const googleUser = await this.googleStrategy.validate(code);
    // assume this returns GoogleUserInfo only

    // 2. Check if user already exists
    const user = await this.usersRepo.findUserByEmail(googleUser.email);

    // 3. Register if new user
    if (!user) {
      return await this.register({
        name: googleUser.name,
        email: googleUser.email,
        password: googleUser.email,
        isEmailVerified: googleUser.verified_email,
        avatar: googleUser.picture,
      });
    }

    const account = await this.accountsRepo.findByUserId(user?._id);

    const accountLifecycle = account
      ? await this.accountLifecycleRepo.findByAccountId(account._id)
      : null;

    // 4. Create JWT
    const accessToken = await this.jwtService.signAsync({
      sub: user?._id.toString(),
      name: user.name,
      email: user.email,
      isEmailVerified: account?.isEmailVerified,
      trialEndAt: toEpoch(accountLifecycle?.trialEndAt),
      accountDeleteAt: toEpoch(accountLifecycle?.accountDeletedAt),
    });

    return {
      token: accessToken,
      user,
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
