import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Server } from 'http';

import { AppModule } from '../src/app.module';
import { AuthResponse } from 'src/auth/types';

import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Users Registration API (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryReplSet;
  let dbConnection: Connection;

  /**
   * ✅ Single source of truth for test environment
   * ❌ No ConfigService
   * ❌ No .env files
   */
  const TEST_ENV = {
    DATABASE_URI: '',
    JWT_SECRET: 'test-jwt-secret',
    JWT_EXPIRESAT: '7d',
    NODE_ENV: 'test',
  };

  beforeAll(async () => {
    // 🧠 Start in-memory MongoDB
    mongo = await MongoMemoryReplSet.create({
      replSet: { count: 1 },
    });
    TEST_ENV.DATABASE_URI = mongo.getUri();

    // 🔥 Inject env vars BEFORE app bootstrap
    process.env.DATABASE_URI = TEST_ENV.DATABASE_URI;
    process.env.JWT_SECRET = TEST_ENV.JWT_SECRET;
    process.env.JWT_EXPIRESAT = TEST_ENV.JWT_EXPIRESAT;
    process.env.NODE_ENV = TEST_ENV.NODE_ENV;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dbConnection = app.get<Connection>(getConnectionToken());
  });

  afterEach(async () => {
    const collections = dbConnection.collections;

    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    // ✅ Let Nest close everything gracefully
    await app.close();

    // ✅ Then stop Mongo
    await mongo.stop();

    // ❌ DO NOT call mongoose.disconnect()

    delete process.env.DATABASE_URI;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_EXPIRESAT;
    delete process.env.NODE_ENV;
  });

  const mockedPayload1 = {
    name: 'Test User 1',
    email: 'user1@example.com',
    password: 'StrongPassword123',
  };
  const mockedPayload2 = {
    name: 'Test User 2',
    email: 'user2@example.com',
    password: 'StrongPassword123',
  };

  it('POST /auth/register → should create user with valid token', async () => {
    const server = app.getHttpServer() as Server;

    // register user 1
    await request(server)
      .post('/auth/register')
      .send(mockedPayload1)
      .expect(201);

    // register user 2
    const res1 = await request(server)
      .post('/auth/register')
      .send(mockedPayload2)
      .expect(201);

    const { user: user2 } = res1.body as AuthResponse;

    // login user 1
    const res2 = await request(server)
      .post('/auth/login')
      .send({
        email: mockedPayload1.email,
        password: mockedPayload1.password,
      })
      .expect(200);

    const { token } = res2.body as AuthResponse;

    // create friend request from user 1 to user 2
    const res3 = await request(server)
      .post(`/friendrequests?friendId=${user2._id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    console.log(res3.body);
  });
});
