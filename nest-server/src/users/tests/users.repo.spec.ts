import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from '../schema/users.schema';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepo } from '../repos/users.repo';
import { CreateUserDto } from '../dto/create-user';

describe('UsersRepo', () => {
  let service: UsersRepo;
  let mongo: MongoMemoryServer;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    // Depic user MODULE
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersRepo],
    }).compile();

    service = module.get(UsersRepo);
    userModel = module.get('UserModel');

    // 🔥 IMPORTANT: ensure unique indexes exist
    await userModel.syncIndexes();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  /**
   * Mock User
   */
  const mockUser: CreateUserDto = {
    email: 'real@example.com',
    name: 'Real User',
    avatar: undefined,
  };

  /**
   * Test :: should really create a user in MongoDB
   */
  it('should really create a user in MongoDB', async () => {
    const user = await service.createUser(mockUser);

    expect(user).toBeDefined();
    if (user) expect(user._id).toBeDefined();
    if (user) expect(user.email).toBe(mockUser.email);
    if (user) expect(user.name).toBe(mockUser.name);
    if (user) expect(user.avatar).toBe(mockUser.avatar);
  });

  it('should throw ConflictException on duplicate email', async () => {
    await service.createUser(mockUser);

    await expect(service.createUser(mockUser)).rejects.toThrow(
      ConflictException,
    );
  });

  it('Test same name', async () => {
    await service.createUser(mockUser);

    const user = await service.createUser({
      ...mockUser,
      email: 'f6o4b@example.com',
    });
    expect(user).toBeDefined();
    if (user) expect(user._id).toBeDefined();
    if (user) expect(user.email).toBe('f6o4b@example.com');
    if (user) expect(user.name).toBe(mockUser.name);
    if (user) expect(user.avatar).toBe(mockUser.avatar);
  });

  it('should throw InternalServerErrorException on invalid ObjectId', async () => {
    await expect(service.findUserById('not-an-id')).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('passing invalid ObjectId :: should return null', async () => {
    const user = await service.findUserById('697c8e20777d9ee2d6afb589');
    expect(user).toBeNull();
  });
});
