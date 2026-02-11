import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Server } from 'http';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // ✅ Let Nest close everything gracefully
    await app.close();
  });

  it('/ (GET)', async () => {
    const server = app.getHttpServer() as Server;

    const res1 = await request(server).get('/');

    console.log(res1.body);
  });
});
