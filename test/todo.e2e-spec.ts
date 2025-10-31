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

describe('CategoryTest (e2e)', () => {
  let app: INestApplication<App>;
  let logger: Logger;
  let testService: TestService;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const reflector = app.get(Reflector);
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    app.useGlobalPipes(new ValidationErrorPipe());
    app.useGlobalInterceptors(new ResponseInterceptor(reflector));

    await app.init();

    await testService.deleteUser();
    await testService.createUser();
    const login = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'test@mail.com',
      password: 'Test_1234567890',
    });

    accessToken = login.body.data.accessToken;
  });

  afterEach(async () => {
    // await testService.deleteCategory();
    await app.close();
  });

  describe('POST /todo', () => {
    afterEach(async () => {
      await testService.deleteTodo();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: '',
          description: '',
          status: '',
          priority: '',
          category: '',
          dueDate: '',
          completed: '',
        });

      logger.info(
        `Test Response Create Todo : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create todo', async () => {
      const response = await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Coding',
          description: 'Coding description',
          status: 'in_progress',
          priority: 'high',
          category: 53,
          dueDate: '10-11-2025',
          completedAt: '11-11-2025',
        });

      logger.info(
        `Test Response Create Todo : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('Coding');
      expect(response.body.data.description).toBe('Coding description');
      expect(response.body.data.status).toBe('in_progress');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.category).toBe(53);
      expect(response.body.data.dueDate).toBe('10-11-2025');
      expect(response.body.data.completedAt).toBe('11-11-2025');
    });
  });

  describe('GET /todo', () => {
    beforeEach(async () => {
      await testService.createManyTodos();
    });

    afterEach(async () => {
      await testService.deleteAllTodo();
    });

    it('should be able to get all Todos', async () => {
      const response = await request(app.getHttpServer())
        .get('/todo')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(
        `Test Response Get All Todos ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
