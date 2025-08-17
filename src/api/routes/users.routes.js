const { Router } = require('express');
const { validate } = require('../middlewares/validate.middleware');
const { CreateUserSchema, UpdateUserSchema } = require('../../application/dtos/user.schema');

function makeUserRoutes(controller, authMiddleware , requireRole) {
  const r = Router();

  r.use(authMiddleware);

  r.post('/', validate(CreateUserSchema), requireRole('admin'), (req, res, next) => controller.create(req, res, next));
  r.get('/', (req, res, next) => controller.list(req, res, next));
  r.put('/:id', validate(UpdateUserSchema), requireRole('admin'), (req, res, next) => controller.update(req, res, next));
  r.delete('/:id', requireRole('admin'), (req, res, next) => controller.remove(req, res, next));

  return r;
}

module.exports = { makeUserRoutes };
