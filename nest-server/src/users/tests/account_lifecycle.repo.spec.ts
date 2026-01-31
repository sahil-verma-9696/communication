import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { Account, AccountSchema } from '../schema/account.schema';
import { UsersRepo } from '../repos/users.repo';
import { User, UserSchema } from '../schema/users.schema';
import { AccountRepo } from '../repos/account.repo';
import {
  AccountLifecycle,
  AccountLifecycleSchema,
} from '../schema/account_lifecycle.schema';
import { AccountLifecycleRepo } from '../repos/account_lifecycle.repo';
import { getNextNthDate } from 'src/utilities/get-next-nth-date';

describe('UsersRepo', () => {
  let accountRepo: AccountRepo;
  let userRepo: UsersRepo;
  let accountLifecycleRepo: AccountLifecycleRepo;

  let mongo: MongoMemoryServer;

  let accountModel: Model<Account>;
  let userModel: Model<User>;
  let accountLifecycleModel: Model<AccountLifecycle>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    // Depic user MODULE
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.getUri()),
        MongooseModule.forFeature([
          { name: Account.name, schema: AccountSchema },
          { name: User.name, schema: UserSchema }, // ✅ ADD THIS
          { name: AccountLifecycle.name, schema: AccountLifecycleSchema },
        ]),
      ],

      providers: [AccountRepo, UsersRepo, AccountLifecycleRepo],
    }).compile();

    accountRepo = module.get(AccountRepo);
    userRepo = module.get(UsersRepo);
    accountLifecycleRepo = module.get(AccountLifecycleRepo);

    accountModel = module.get('AccountModel');
    userModel = module.get('UserModel');
    accountLifecycleModel = module.get('AccountLifecycleModel');

    // 🔥 IMPORTANT: ensure unique indexes exist
    await accountModel.syncIndexes();
    await userModel.syncIndexes();
    await accountLifecycleModel.syncIndexes();
  });

  afterEach(async () => {
    await accountModel.deleteMany({});
    await userModel.deleteMany({});
    await accountLifecycleModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('should create', async () => {
    const user = await userRepo.createUser({
      name: 'John Doe',
      email: 'j@j.com',
    });

    const account = user
      ? await accountRepo.createWithPopulate({
          user: user?._id,
          passwordHash: 'password',
        })
      : null;

    const accountLifecycle = account
      ? await accountLifecycleRepo.create({
          account: account?._id,
        })
      : null;

    expect(accountLifecycle).toBeDefined();
    expect(accountLifecycle?.trialEndAt.getUTCDate()).toBe(
      getNextNthDate(3).getUTCDate(),
    );
    expect(accountLifecycle?.accountDeletedAt.getUTCDate()).toBe(
      getNextNthDate(6).getUTCDate(),
    );
  });
});
