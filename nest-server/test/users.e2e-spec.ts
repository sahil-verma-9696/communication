import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { Server } from 'http';

import { AppModule } from '../src/app.module';
import { AuthResponse } from 'src/auth/types';
import { JwtPayload } from 'src/auth/auth.guard';

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

  const mockedPayload = {
    name: 'Real User',
    email: 'real@example.com',
    password: 'StrongPassword123',
  };

  it('POST /auth/register → should create user with valid token', async () => {
    const server = app.getHttpServer() as Server;

    const res = await request(server)
      .post('/auth/register')
      .send(mockedPayload)
      .expect(201);

    const { token, user } = res.body as AuthResponse;

    // 1️⃣ Token exists
    expect(token).toBeDefined();

    // 2️⃣ JWT structure
    expect(token.split('.')).toHaveLength(3);

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, TEST_ENV.JWT_SECRET) as JwtPayload;

    // 4️⃣ Payload validation
    expect(decoded.sub).toBe(user._id);
    expect(decoded.email).toBe(mockedPayload.email);
    expect(decoded.username).toBe(mockedPayload.name);

    // 5️⃣ Expiry validation
    expect(decoded.exp).toBeGreaterThan(decoded.iat!);
  });

  it('POST /auth/register → should throw if email already exists', async () => {
    const server = app.getHttpServer() as Server;

    await request(server)
      .post('/auth/register')
      .send({
        name: 'User',
        email: 'duplicate@example.com',
        password: 'StrongPassword123',
      })
      .expect(201);

    await request(server)
      .post('/auth/register')
      .send({
        name: 'User',
        email: 'duplicate@example.com',
        password: 'StrongPassword123',
      })
      .expect(409);
  });

  it.only('GET /users/:id/profile → should return 200', async () => {
    const server = app.getHttpServer() as Server;

    const res1 = await request(server)
      .post('/auth/register')
      .send({
        name: 'User',
        email: 'duplicate@example.com',
        password: 'StrongPassword123',
      })
      .expect(201);

    const { token } = res1.body as AuthResponse;

    const decoded = jwt.verify(token, TEST_ENV.JWT_SECRET) as JwtPayload;

    const res = await request(server).get(`/users/${decoded.sub}/profile`);

    console.log(res.body);
  });
});
