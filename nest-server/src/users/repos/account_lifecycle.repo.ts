import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AccountLifecycle,
  AccountLifecycleDocument,
} from '../schema/account_lifecycle.schema';
import { Model, Types } from 'mongoose';
import { handleMongoDbErrors } from 'src/utilities/handle-mongodb-error';

@Injectable()
export class AccountLifecycleRepo {
  constructor(
    @InjectModel(AccountLifecycle.name)
    private accountLifecycleModel: Model<AccountLifecycleDocument>,
  ) {}

  create(payload: Pick<AccountLifecycle, 'account'>) {
    return handleMongoDbErrors(() =>
      this.accountLifecycleModel.create(payload),
    );
  }

  findById(id: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.accountLifecycleModel.findById(new Types.ObjectId(id)),
    );
  }

  findByAccountId(accountId: string | Types.ObjectId) {
    return handleMongoDbErrors(() =>
      this.accountLifecycleModel.findOne({
        account: new Types.ObjectId(accountId),
      }),
    );
  }

  findAll() {
    return handleMongoDbErrors(() =>
      this.accountLifecycleModel.find({}).populate('account'),
    );
  }
}
