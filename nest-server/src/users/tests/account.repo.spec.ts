import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { Account, AccountSchema } from '../schema/account.schema';
import { UsersRepo } from '../repos/users.repo';
import { User, UserSchema } from '../schema/users.schema';
import { AccountRepo } from '../repos/account.repo';

describe('UsersRepo', () => {
  let accountRepo: AccountRepo;
  let userRepo: UsersRepo;

  let mongo: MongoMemoryServer;

  let accountModel: Model<Account>;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    // Depic user MODULE
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.getUri()),
        MongooseModule.forFeature([
          { name: Account.name, schema: AccountSchema },
          { name: User.name, schema: UserSchema }, // ✅ ADD THIS
        ]),
      ],

      providers: [AccountRepo, UsersRepo],
    }).compile();

    accountRepo = module.get(AccountRepo);
    userRepo = module.get(UsersRepo);

    accountModel = module.get('AccountModel');
    userModel = module.get('UserModel');

    // 🔥 IMPORTANT: ensure unique indexes exist
    await accountModel.syncIndexes();
    await userModel.syncIndexes();
  });

  afterEach(async () => {
    await accountModel.deleteMany({});
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('should create account', async () => {
    const user = await userRepo.createUser({
      name: 'John Doe',
      email: 'j@j.com',
    });

    const account = user
      ? await accountRepo.create({
          user: user?._id,
          passwordHash: 'password',
        })
      : null;

    expect(account).toBeDefined();
    expect(account?.user).toBe(user?._id);
  });

  it('should create and populate', async () => {
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

    expect(account).toBeDefined();
    expect(account?.user._id.toString()).toBe(user?._id.toString());
    expect(account?.user.email).toBe(user?.email);
    expect(account?.user.name).toBe(user?.name);
  });
});
