import * as chai from 'chai';
import request from 'supertest';
import { app } from '../../src/routes/route.handler.js';

const { expect } = chai;

describe('Admin API', () => {
  let adminToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/user/signin')
      .send({ email: 'admin@zanly.com', password: 'adminpass' });

    adminToken = res.body.token;
  });

  it('GET /admin/users should fetch all users', async () => {
    const res = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.users).to.be.an('array');
  });

  it('PATCH /admin/user/:id/role should change role', async () => {
    const usersRes = await request(app)
      .get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    const userId = usersRes.body.users[0].id;

    const res = await request(app)
      .patch(`/admin/user/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' });

    expect(res.status).to.equal(200);
    expect(res.body.user.role).to.equal('admin');
  });
});
