import * as chai from 'chai';
import request from 'supertest';
import { app } from '../../src/routes/route.handler.js';

const { expect } = chai;

describe('User API', () => {
  let token;

  it('POST /user/signup should create user', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({ name: 'API User', email: 'apiuser@test.com', password: '123456' });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Signup complete');
  });

  it('POST /user/signin should login user', async () => {
    const res = await request(app)
      .post('/user/signin')
      .send({ email: 'apiuser@test.com', password: '123456' });

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Login success');
    token = res.body.token;
  });

  it('GET /user/get should fetch logged-in user', async () => {
    const res = await request(app)
      .get('/user/get')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.user.email).to.equal('apiuser@test.com');
  });
});
