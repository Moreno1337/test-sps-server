const { Router } = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { LoginSchema } = require('../../application/dtos/user.schema');

function makeAuthRoutes(authController) {
  const router = Router();

  router.post('/login', validate(LoginSchema), (req, res, next) => authController.login(req, res, next));

  return router;
}

module.exports = { makeAuthRoutes };