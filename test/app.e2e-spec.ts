import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Worker } from 'worker_threads';
import { AppModule } from '../src/app.module';
import { WishesCreateDto } from '../src/wishes/dto/wishes-create.dto';
import { UsersCreateDto } from '../src/users/dto/users-create.dto';

jest.mock('worker_threads');

describe('Wishes and Auth E2E Tests', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let wishes_uuid: string;
  let wishes_body: WishesCreateDto;
  let user: UsersCreateDto;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    entityManager = moduleFixture.get<EntityManager>(EntityManager);
    wishes_body = {
      wishes: 'Test wishes!',
      from: 'Test user 1',
      to: 'Test user 2',
    } as WishesCreateDto;
    user = {
      username: 'testUser',
      password: 'testPassword',
    };
    await app.init();
  });

  it('should sign up a user', async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((response) => {
        expect(response.body.user).toBeDefined();
        expect(response.body.token).toBeDefined();
        accessToken = response.body.token;
      });
  });

  it('should throw auth error during preparing a wish', async () => {
    return request(app.getHttpServer())
      .post('/wishes/prepare')
      .set('Authorization', `Bearer fake_token`)
      .send(wishes_body)
      .expect(401);
  });

  it('should prepare a wish', async () => {
    return request(app.getHttpServer())
      .post('/wishes/prepare')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(wishes_body)
      .expect(201)
      .then((response) => {
        expect(response.body.wishes_uuid).toBeDefined();
        wishes_uuid = response.body.wishes_uuid;
        expect(Worker).toHaveBeenCalled();
      });
  });

  it('should check the status of a wish', async () => {
    return request(app.getHttpServer())
      .get(`/wishes/status/${wishes_uuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.wishes_status).toBeDefined();
      });
  });

  it('should throw not found exception during checking the status of a wish', async () => {
    return request(app.getHttpServer())
      .get(`/wishes/status/fake_id`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should get the result of a wish', async () => {
    return request(app.getHttpServer())
      .get(`/wishes/result/${wishes_uuid}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.pow_nonce).toBeDefined();
        expect(response.body.hash).toBeDefined();
        expect(response.body.hash.startsWith('00')).toBe(true);
      });
  });

  it('should throw not found exception during getting the result of a wish', async () => {
    return request(app.getHttpServer())
      .get(`/wishes/result/fake_id`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  afterAll(async () => {
    await entityManager.delete('user', { username: user.username });
    await entityManager.delete('wish', { wishes_uuid });
    await app.close();
  });
});
