import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { ValidationErrorPipe } from '../src/common/pipes/validation-error.pipe';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { Reflector } from '@nestjs/core';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AuthTest (e2e)', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationErrorPipe());
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ResponseInterceptor(reflector));
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    await app.init();
  });

  describe('POST /auth/register', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });
    it('should reject if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: '',
          username: '',
          email: '',
          password: '',
        });

      logger.info(`Response : ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test',
          username: 'test5',
          email: 'test5@mail.com',
          password: '@Test123456',
        });

      logger.info(`Response : ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(201);
      expect(response.body.data.fullName).toBe('Test');
      expect(response.body.data.username).toBe('test5');
      expect(response.body.data.email).toBe('test5@mail.com');
    });

    it('should be reject if username already registered', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test',
          username: 'test5',
          email: 'test5@mail.com',
          password: '@Test123456',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test',
          username: 'test5',
          email: 'test6@mail.com',
          password: '@Test123456',
        });

      logger.info(`Response : ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(409);
      expect(response.body.error).toBeDefined();
    });

    it('should be reject if email already registered', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test',
          username: 'test5',
          email: 'test5@mail.com',
          password: '@Test123456',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test',
          username: 'test6',
          email: 'test5@mail.com',
          password: '@Test123456',
        });

      logger.info(`Response : ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(409);
      expect(response.body.error).toBeDefined();
    });
  });
});
