const request = require('supertest');
const { makeTestApp } = require('../helpers/test-app.helper');

describe('Users API (e2e)', () => {
  let app;
  let adminToken;

  beforeAll(async () => {
    const ctx = await makeTestApp();
    app = ctx.app;

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@sps.com', password: 'admin123' });

    expect(res.status).toBe(200);
    adminToken = res.body.token;
    expect(typeof adminToken).toBe('string');
  });

  test('GET /users requires auth -> 401', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(401);
  });

  test('POST /users validation -> 400 when missing fields', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'No Email', type: 'user', password: '123456' });

    expect(res.status).toBe(400);
  });

  describe('CRUD flow', () => {
    const baseEmail = `joao+${Date.now()}@sps.com`;
    let userId;

    test('POST /users -> 201 create', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Joao',
          email: baseEmail,
          type: 'user',
          password: '123456'
        });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        name: 'Joao',
        email: baseEmail,
        type: 'user'
      });
      expect(res.body.id).toBeDefined();
      userId = res.body.id;
    });

    test('POST /users duplicate email -> 400', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Someone',
          email: baseEmail,
          type: 'user',
          password: 'abcdef'
        });
      expect(res.status).toBe(400);
    });

    test('GET /users -> 200 list includes created user', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find(u => u.email === baseEmail);
      expect(found).toBeTruthy();
      expect(found).toHaveProperty('id', userId);
      expect(found.passwordHash).toBeUndefined();
    });

    test('PUT /users/:id -> 200 update name', async () => {
      const res = await request(app)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Joao Pedro' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: userId,
        name: 'Joao Pedro',
        email: baseEmail,
        type: 'user'
      });
    });

    test('PUT /users/:id -> 200 update password and re-login works', async () => {
      const newPass = 'newpass123';
      const updateRes = await request(app)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ password: newPass });

      expect(updateRes.status).toBe(200);

      const badLogin = await request(app)
        .post('/auth/login')
        .send({ email: baseEmail, password: '123456' });
      expect(badLogin.status).toBe(401);

      const goodLogin = await request(app)
        .post('/auth/login')
        .send({ email: baseEmail, password: newPass });
      expect(goodLogin.status).toBe(200);
      expect(typeof goodLogin.body.token).toBe('string');
    });

    test('DELETE /users/:id -> 204', async () => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    test('DELETE /users/:id again -> 400 not found', async () => {
      const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
    });

    test('GET /users after delete -> not present', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      const found = res.body.find(u => u.id === userId);
      expect(found).toBeUndefined();
    });
  });

  describe.skip('Role requirement', () => {
    let userToken;
    const userEmail = `user+${Date.now()}@sps.com`;
    const userPass = 'userpass';

    test('setup: admin creates a regular user and logs in', async () => {
      const create = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Regular', email: userEmail, type: 'user', password: userPass });
      expect(create.status).toBe(201);

      const login = await request(app)
        .post('/auth/login')
        .send({ email: userEmail, password: userPass });
      expect(login.status).toBe(200);
      userToken = login.body.token;
    });

    test('regular user cannot create another user -> 403', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Nope', email: `blocked+${Date.now()}@sps.com`, type: 'user', password: 'x' });

      expect(res.status).toBe(403);
    });
  });
});
