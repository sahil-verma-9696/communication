import { Injectable } from '@nestjs/common';
import { AuthStrategy } from './types/strategy.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy implements AuthStrategy {
  constructor(private readonly usersService: UsersService) {}

  /**
   * local validation
   * ------------------
   * @param username
   * @param password
   * @returns { boolean | Promise<boolean> }
   */
  async validate(email: string, password: string): Promise<boolean> {
    // Input Validation
    if (!email || !password) return false;

    // local state
    let isValid = false;

    const user = await this.usersService.getUserByEmail(email);

    if (!user) return false;

    isValid = await this.usersService.verfiyPassword(
      user._id.toString(),
      password,
    );

    return isValid;
  }
}
