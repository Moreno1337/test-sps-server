const express = require('express');
const cors = require('cors');

const { requireRole } = require('../api/middlewares/auth.middleware')
const { makeAuthRoutes } = require('../api/routes/auth.routes');
const { makeUserRoutes } = require('../api/routes/users.routes');

const { mountSwagger } = require('./swagger');

function createApp(container) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  app.use('/auth', makeAuthRoutes(container.controllers.authController));
  app.use('/users', makeUserRoutes(container.controllers.usersController, container.middlewares.authMiddleware, requireRole));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  mountSwagger(app, { route: '/docs', title: 'SPS Test API Docs' });

  return app;
}

module.exports = { createApp };
