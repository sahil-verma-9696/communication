import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';
import {
  Account,
  AccountDocument,
  AccountWithUserDoc,
} from '../schema/account.schema';
import { CreateAccountDto } from '../dto/create-account';

/**
 * Account Repository
 * ----------------
 *
 * It is responsible for `interacting with the database`.
 * handle error and exceptions regarding the database.
 */
@Injectable()
export class AccountRepo {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  /**
   * Create account
   */
  create(account: CreateAccountDto) {
    return handleMongoDbErrors(() => this.accountModel.create(account));
  }

  /**
   * Create account get expanded account.
   */
  createWithPopulate(account: CreateAccountDto): Promise<AccountWithUserDoc> {
    return handleMongoDbErrors(() =>
      this.accountModel.create(account).then((a) => a.populate(['user'])),
    );
  }

  /**
   * Find account by id
   */
  findById(accountId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.accountModel.findById(accountId).exec(),
    );
  }

  /**
   * Find account by user id
   */
  findByUserId(userId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.accountModel
        .findOne({ user: new Types.ObjectId(userId) })
        .select('+passwordHash'),
    );
  }

  /**
   * Update account by id
   */
  updateById(accountId: string | Types.ObjectId, update: Partial<Account>) {
    return handleMongoDbErrors(() =>
      this.accountModel.findByIdAndUpdate(accountId, update, { new: true }),
    );
  }

  /**
   * Update account status
   */
  updateStatus(accountId: string | Types.ObjectId, status: Account['status']) {
    return handleMongoDbErrors(() =>
      this.accountModel.findByIdAndUpdate(accountId, { status }, { new: true }),
    );
  }

  /**
   * Delete account (hard delete)
   */
  deleteById(accountId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.accountModel.deleteOne({ _id: accountId }),
    );
  }
}
