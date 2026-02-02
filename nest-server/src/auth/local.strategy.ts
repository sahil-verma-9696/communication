import { Injectable } from '@nestjs/common';
import { UsersRepo } from 'src/users/repos/users.repo';
import { AccountRepo } from 'src/users/repos/account.repo';
import { UserDocument } from 'src/users/schema/users.schema';
import { AccountDocument } from 'src/users/schema/account.schema';

@Injectable()
export class LocalStrategy {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly accountsRepo: AccountRepo,
  ) {}

  /**
   * local validation
   * ------------------
   * @description
   * - It is used to validate `User` based on `email` and `password`.
   * - after validation it return `user` or `null`.
   */
  async validate(
    email: string,
    password: string,
  ): Promise<{ user: UserDocument; account: AccountDocument } | null> {
    if (!email || !password) return null;

    const user = await this.usersRepo.findUserByEmail(email);

    if (!user) return null;

    const account = await this.accountsRepo.findByUserIdWithPassword(user._id);

    if (!account) return null;

    if (!(await account.verifyPassword(password))) return null;

    return { user, account };
  }
}
