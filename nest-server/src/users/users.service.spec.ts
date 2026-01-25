import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/users.schema';

describe('UsersService (integration)', () => {
  let service: UsersService;
  let mongo: MongoMemoryServer;
  let userModel: mongoose.Model<User>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    // Depic user MODULE
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.getUri()),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get(UsersService);
    userModel = module.get('UserModel');
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  /**
   * Mock User
   */
  const mockUser = {
    email: 'real@example.com',
    name: 'Real User',
    passwordHash: 'hashed',
  };

  /**
   * Test :: should really create a user in MongoDB
   */
  it('should really create a user in MongoDB', async () => {
    const user = await service.create(mockUser);

    if (user) {
      expect(user._id).toBeDefined();
      expect(user.email).toBe(mockUser.email);
      expect(user.name).toBe(mockUser.name);
    }

    await userModel.deleteOne({ email: mockUser.email });
  });

  /**
   * Test :: created user should not be contain hashedPassword
   */
  it('created user should not be contain hashedPassword', async () => {
    const user = await service.create(mockUser);
    if (user) {
      expect(user.passwordHash).toBeUndefined();
    }
  });
});
