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
import { UsersService } from '../users.service';

describe('User Service', () => {
  let accountRepo: AccountRepo;
  let userRepo: UsersRepo;
  let accountLifecycleRepo: AccountLifecycleRepo;

  let userService: UsersService;

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
          { name: User.name, schema: UserSchema },
          { name: AccountLifecycle.name, schema: AccountLifecycleSchema },
        ]),
      ],

      providers: [AccountRepo, UsersRepo, AccountLifecycleRepo, UsersService],
    }).compile();

    accountRepo = module.get(AccountRepo);
    userRepo = module.get(UsersRepo);
    accountLifecycleRepo = module.get(AccountLifecycleRepo);

    userService = module.get(UsersService);

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

  it('should user register with unverified email', async () => {
    const user = await userService.registerNewUser({
      name: 'John Doe',
      email: 'j@j.com',
      password: 'password',
    });

    const checkUser = await userRepo.findUserByEmail('j@j.com');

    const userAccount = user
      ? await accountRepo.findById(user?.account._id)
      : null;

    const accountLifecycle = user?.accountLifecycle
      ? await accountLifecycleRepo.findById(user.accountLifecycle._id)
      : null;

    expect(user).toBeDefined();
    expect(checkUser).toBeDefined();
    expect(userAccount).toBeDefined();
    expect(accountLifecycle).toBeDefined();

    expect(user?.user.name).toBe('John Doe');
    expect(user?.user.email).toBe('j@j.com');
    expect(user?.account.isEmailVerified).toBe(false);
  });

  it('should user register with verified email', async () => {
    const user = await userService.registerNewUser({
      name: 'John Doe',
      email: 'j@j.com',
      password: 'password',
      isEmailVerified: true,
    });

    const checkUser = await userRepo.findUserByEmail('j@j.com');

    const userAccount = user
      ? await accountRepo.findById(user?.account._id)
      : null;

    const accountLifecycle = user?.accountLifecycle
      ? await accountLifecycleRepo.findById(user.accountLifecycle._id)
      : null;

    expect(user).toBeDefined();
    expect(checkUser).toBeDefined();
    expect(userAccount).toBeDefined();
    expect(accountLifecycle).toBeNull();

    expect(user?.user.name).toBe('John Doe');
    expect(user?.user.email).toBe('j@j.com');
    expect(user?.account.isEmailVerified).toBe(true);
  });

  it('should return user profile', async () => {
    const user = await userService.registerNewUser({
      name: 'John Doe',
      email: 'j@j.com',
      password: 'password',
    });

    expect(user).toBeDefined();

    if (!user) return;

    const userProfile = await userService.getUserProfile(user.user._id);

  });

  it('should account have verifyPassword function', async () => {
    const user = await userService.registerNewUser({
      name: 'John Doe',
      email: 'j@j.com',
      password: 'password',
    });

    const account = user ? await accountRepo.findByUserId(user?.userId) : null;

    console.log('account instanceof model:', account instanceof Object);
    console.log('constructor:', account.constructor?.name);
    console.log('has verifyPassword:', typeof (account as any).verifyPassword);
    console.log(
      'has $isMongooseDocument:',
      (account as any).$isMongooseDocument,
    );
    console.log(account);
  });
});
