import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Logger } from 'winston';
import { TestService } from '../test.service';
import { TestModule } from '../test.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('User Controller Test', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
    await app.init();
  });

  describe('POST /api/contacts/', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should return 400 if request is invalid', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', token)
        .send({
          first_name: '',
          last_name: '',
          email: '',
        });

      expect(contactResponse.status).toBe(400);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should create a new contact', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', token)
        .send({
          first_name: 'Test',
          last_name: '',
          email: 'log@hafizcaniago.my.id',
          phone: '628712312312',
          social_linkedin: 'https://linkedin.com',
          social_fb: 'https://facebook.com',
          social_x: 'https://x.com',
          social_yt: '',
          social_ig: '',
          social_github: '',
          userId: user.id,
        });

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(201);
      expect(contactResponse.body.data.first_name).toBe('Test');
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get('/api/contacts/1')
        .set('Authorization', token);

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should return a contact', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', token);

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data.id).toBe(contact.id);
    });
  });

  describe('PATCH /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .patch('/api/contacts/99')
        .set('Authorization', token)
        .send({
          first_name: 'Test',
        });

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should return 400 if request is invalid', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}`)
        .set('Authorization', token)
        .send({
          first_name: '',
        });

      expect(contactResponse.status).toBe(400);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should update a contact', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .patch(`/api/contacts/${contact.id}`)
        .set('Authorization', token)
        .send({
          first_name: 'Test',
        });

      logger.info(contactResponse.body);

      expect(contactResponse.status).toBe(200);
      expect(contactResponse.body.data.first_name).toBe('Test');
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should return 404 if contact not found', async () => {
      const user = await testService.createUser(true);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .delete('/api/contacts/99')
        .set('Authorization', token);

      expect(contactResponse.status).toBe(404);
      expect(contactResponse.body.errors).toBeDefined();
    });

    it('should delete a contact', async () => {
      const user = await testService.createUser(true);
      const contact = await testService.createContact(user.id);

      const token = user.token;
      const contactResponse = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}`)
        .set('Authorization', token);

      expect(contactResponse.status).toBe(200);
    });
  });

  afterAll(async () => {
    await testService.deleteContact();
    await testService.deleteUser();
  });
});
