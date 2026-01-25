import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { Server } from 'http';
import { AuthResponse } from 'src/auth/types';
import { JwtPayload } from 'src/auth/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';

describe('Users Registration API (e2e)', () => {
  let app: INestApplication;
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('database.uri'),
          }),
        }),
        AppModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          switch (key) {
            case 'database.uri':
              return mongo.getUri();

            case 'jwt.secret':
              return 'test-jwt-secret';

            case 'jwt.expiresIn':
              return '7d';

            default:
              return null;
          }
        },
      })
      .compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
    await app.close();
  });

  const mokedPayload = {
    name: 'Real User',
    email: 'real@example.com',
    password: 'StrongPassword123',
  };

  it('POST /auth/register → should create user with valid token', async () => {
    const server = app.getHttpServer() as Server;

    const res = await request(server)
      .post('/auth/register')
      .send(mokedPayload)
      .expect(201);

    const { token, user, expiresIn } = res.body as AuthResponse;

    // 1️⃣ Token exists
    expect(token).toBeDefined();

    // 2️⃣ Token is a valid JWT (3 parts)
    expect(token.split('.')).toHaveLength(3);

    // 3️⃣ Verify token signature & decode payload
    const decoded = jwt.verify(token, 'test-jwt-secret') as JwtPayload;

    // 4️⃣ Payload correctness
    expect(decoded.sub).toBe(user._id);
    expect(decoded.email).toBe(mokedPayload.email);
    expect(decoded.username).toBe(mokedPayload.name);

    // 5️⃣ Expiry correctness
    const issuedAt = decoded.iat; // seconds
    const expiresAt = decoded.exp; // seconds

    expect(expiresAt).toBeGreaterThan(issuedAt!);

    // expiresIn from API (ms)
    const expectedExpirySeconds = Number(expiresIn) / 1000;

    expect(expiresAt! - issuedAt!).toBe(expectedExpirySeconds);
  });

  it('POST /auth/register → should throw if email already exists', async () => {
    const mokedPayload = {
      name: 'Real User',
      email: 'real1@example.com',
      password: 'StrongPassword123',
    };
    const server = app.getHttpServer() as Server;

    await request(server).post('/auth/register').send(mokedPayload).expect(201);

    await request(server).post('/auth/register').send(mokedPayload).expect(409);
  });
});
