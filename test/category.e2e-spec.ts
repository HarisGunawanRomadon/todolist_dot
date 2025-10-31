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

  describe('POST /category', () => {
    it("must be rejected if user don't have a token", async () => {
      const response = await request(app.getHttpServer())
        .post('/category')
        .send({
          name: 'Work',
        });

      logger.info(
        `Test Response Create Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    it('must be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: '',
        });

      logger.info(
        `Test Response Create Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('must be rejected if category duplicate', async () => {
      await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Work',
        });

      const response = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Work',
        });

      logger.info(
        `Test Response Duplicate Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(409);
      expect(response.body.error).toBeDefined();
    });

    it('must be able to create category', async () => {
      const response = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Work',
        });

      logger.info(
        `Test Response Create Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('Work');
    });
  });

  describe('GET /category', () => {
    beforeEach(async () => {
      await testService.createManyCategory();
    });

    it('should be able get all category', async () => {
      const response = await request(app.getHttpServer())
        .get('/category')
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(
        `Test Response Get All Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('DELETE /category/:id', () => {
    beforeEach(async () => {
      await testService.createCategory();
    });

    it('should be reject if category not found', async () => {
      const category = await testService.getCategory();

      const response = await request(app.getHttpServer())
        .delete(`/category/${category + 1}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(
        `Test Response Delete Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should be able to delete category', async () => {
      const category = await testService.getCategory();

      const response = await request(app.getHttpServer())
        .delete(`/category/${category}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(
        `Test Response Delete Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(200);
    });
  });

  describe('Get /category/:id', () => {
    beforeEach(async () => {
      await testService.createCategory();
    });

    it('should be reject if category not found', async () => {
      const category = await testService.getCategory();

      const response = await request(app.getHttpServer())
        .delete(`/category/${category + 1}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(
        `Test Response Get Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should be able to get category', async () => {
      const category = await testService.getCategory();

      const response = await request(app.getHttpServer())
        .delete(`/category/${category}`)
        .set('Authorization', `Bearer ${accessToken}`);

      logger.info(
        `Test Response Get Category : ${JSON.stringify(response.body)}`,
      );

      expect(response.status).toBe(200);
    });
  });
});
