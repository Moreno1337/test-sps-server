const { buildContainer } = require('../../src/main/container');
const { createApp } = require('../../src/main/app');
const { seedAdmin } = require('../../src/infrastructure/persistence/seed');

async function makeTestApp() {
  const container = buildContainer();
  await seedAdmin(container.repos.userRepository);
  const app = createApp(container);
  return { app, container };
}

module.exports = { makeTestApp };
