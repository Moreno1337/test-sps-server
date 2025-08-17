const request = require('supertest');
const { makeTestApp } = require('../helpers/test-app.helper');

let app; beforeAll(async () => {
  const ctx = await makeTestApp();
  app = ctx.app;
});

test('login ok', async () => {
  const res = await request(app).post('/auth/login')
    .send({ email:'admin@sps.com', password:'admin123' });
  expect(res.status).toBe(200);
  expect(typeof res.body.token).toBe('string');
  expect(res.body.user.email).toBe('admin@sps.com');
});

test('login 401', async () => {
  const res = await request(app).post('/auth/login')
    .send({ email:'admin@sps.com', password:'wrong' });
  expect(res.status).toBe(401);
});
