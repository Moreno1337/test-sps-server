const { env } = require('../infrastructure/config/env');
const { buildContainer } = require('./container');
const { createApp } = require('./app');
const { seedAdmin } = require('../infrastructure/persistence/seed');

async function start() {
  const container = buildContainer();
  await seedAdmin(container.repos.userRepository);

  const app = createApp(container);
  const port = Number(env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`API is running on http://localhost:${port}`);
  });
}

start().catch(err => {
  console.error('API failed to initialize', err);
  process.exit(1);
});