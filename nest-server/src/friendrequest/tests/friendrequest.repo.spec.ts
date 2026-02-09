import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import {
  FriendRequest,
  FriendRequestSchema,
  FriendRequestStatus,
} from '../schema/friendrequests.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { FriendRequestRepo } from '../repos/friendrequest.repo';
import { User, UserSchema } from 'src/users/schema/users.schema';

describe('FriendRequest Repo', () => {
  let module: TestingModule;
  let mongo: MongoMemoryServer;

  let friendRequestRepo: FriendRequestRepo;
  let friendrequestModel: Model<FriendRequest>;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.getUri()),
        MongooseModule.forFeature([
          { name: FriendRequest.name, schema: FriendRequestSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [FriendRequestRepo],
    }).compile();

    friendRequestRepo = module.get(FriendRequestRepo);

    friendrequestModel = module.get(getModelToken(FriendRequest.name));
    userModel = module.get(getModelToken(User.name));

    await friendrequestModel.syncIndexes();
    await userModel.syncIndexes();
  });

  afterEach(async () => {
    await friendrequestModel.deleteMany({});
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await module.close(); // 🔥 close Nest
    await mongoose.disconnect(); // 🔥 close mongoose
    await mongo.stop(); // 🔥 stop MongoMemory
  });

  /**
   * Moock Data
   */
  const user_a = {
    email: 'a@a.com',
    password: 'password',
    name: 'A',
    isEmailVerified: true,
  };
  const user_b = {
    email: 'b@a.com',
    password: 'password',
    name: 'B',
    isEmailVerified: true,
  };
  const user_c = {
    email: 'c@a.com',
    password: 'password',
    name: 'C',
    isEmailVerified: true,
  };
  const user_d = {
    email: 'd@a.com',
    name: 'D',
    isEmailVerified: true,
  };

  it('should create a friend request', async () => {
    const userA = await userModel.create(user_a);
    const userB = await userModel.create(user_b);

    if (!userA || !userB) return;

    const req = await friendRequestRepo.create({
      sender: userA._id,
      receiver: userB._id,
    });

    expect(req).toBeDefined();
    expect(req.sender).toBe(userA._id);
    expect(req.receiver).toBe(userB._id);
    expect(req.status).toBe(FriendRequestStatus.PENDING);
  });

  it('should get a friend request by id', async () => {
    const userA = await userModel.create(user_a);
    const userB = await userModel.create(user_b);

    if (!userA || !userB) return;

    const req = await friendRequestRepo.create({
      sender: userA._id,
      receiver: userB._id,
    });

    if (!req) return;

    const reqById = await friendRequestRepo.getByIdPopulated(req._id);

    if (!reqById) return;

    expect(reqById).toBeDefined();
    expect(reqById._id.toString()).toBe(req._id.toString());
    expect(reqById.status).toBe(FriendRequestStatus.PENDING);
    expect(reqById.sender._id.toString()).toBe(userA._id.toString());
    expect(reqById.receiver._id.toString()).toBe(userB._id.toString());
  });

  it('should update status by id', async () => {
    const userA = await userModel.create(user_a);
    const userB = await userModel.create(user_b);

    if (!userA || !userB) return;

    const req = await friendRequestRepo.create({
      sender: userA._id,
      receiver: userB._id,
    });

    if (!req) return;

    const res1 = await friendRequestRepo.updateStatusRaw(
      req._id,
      FriendRequestStatus.ACCEPTED,
    );

    if (!res1) return;

    console.log(res1);

    expect(res1).toBeDefined();
    expect(res1.status).toBe(FriendRequestStatus.ACCEPTED);
  });

  it.only('should return all friend requests (populated)', async () => {
    const userA = await userModel.create(user_a);
    const userB = await userModel.create(user_b);
    const userC = await userModel.create(user_c);
    const userD = await userModel.create(user_d);

    const req = await friendRequestRepo.create({
      sender: userA._id,
      receiver: userB._id,
    });

    const req1 = await friendRequestRepo.create({
      sender: userC._id,
      receiver: userA._id,
    });

    const req2 = await friendRequestRepo.create({
      sender: userD._id,
      receiver: userA._id,
    });

    const result = await friendRequestRepo.getFriendRequestByUserIdPopulated(
      userA._id,
    );

    // ---------------- BASIC SHAPE ----------------

    expect(result).toBeDefined();
    expect(result.sendTo).toHaveLength(1);
    expect(result.receiveFrom).toHaveLength(2);

    // ---------------- SENT REQUEST ----------------

    const sent = result.sendTo[0];

    expect(sent.to.name).toBe('B');
    expect(sent.to.email).toBe('b@a.com');

    // ---------------- RECEIVED REQUESTS ----------------

    const receivedNames = result.receiveFrom.map((r) => r.from.name).sort();

    expect(receivedNames).toEqual(['C', 'D']);

    // Validate populated structure
    result.receiveFrom.forEach((r) => {
      expect(r.from._id).toBeDefined();
      expect(r.from.email).toMatch(/@a\.com$/);
      expect(r.from.createdAt).toBeInstanceOf(Date);
    });
  });
});
