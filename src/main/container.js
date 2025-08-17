const { env } = require('../infrastructure/config/env');

const { makeInMemoryUserRepository } = require('../infrastructure/persistence/in-memory-user.repository');

const { makeBcryptHashService } = require('../infrastructure/security/bcrypt-hash.service');
const { makeJwtTokenService } = require('../infrastructure/security/jwt-token.service');

const { makeAuthenticateUser } = require('../application/use-cases/authenticate-user.usecase');
const { makeCreateUser } = require('../application/use-cases/create-user.usecase');
const { makeListUsers } = require('../application/use-cases/list-users.usecase');
const { makeUpdateUser } = require('../application/use-cases/update-user.usecase');
const { makeDeleteUser } = require('../application/use-cases/delete-user.usecase');

const { makeAuthController } = require('../api/controllers/auth.controller');
const { makeUsersController } = require('../api/controllers/users.controller');

const { makeAuthMiddleware } = require('../api/middlewares/auth.middleware');

function buildContainer() {
  const userRepository = makeInMemoryUserRepository();
  
  const hashService = makeBcryptHashService(10);
  const tokenService = makeJwtTokenService(env.JWT_SECRET);

  const authenticateUser = makeAuthenticateUser({
    userRepository, hashService, tokenService, jwtTtl: env.JWT_TTL,
  });
  const createUser = makeCreateUser({ userRepository, hashService });
  const listUsers  = makeListUsers({ userRepository });
  const updateUser = makeUpdateUser({ userRepository, hashService });
  const deleteUser = makeDeleteUser({ userRepository });

  const authController = makeAuthController({ authenticateUser });
  const usersController = makeUsersController({ createUser, listUsers, updateUser, deleteUser })

  const authMiddleware = makeAuthMiddleware({ tokenService });

  return {
    env,
    repos: { userRepository },
    services: { hashService, tokenService },
    useCases: { authenticateUser, createUser, listUsers, updateUser, deleteUser },
    controllers: { authController, usersController },
    middlewares: { authMiddleware },
  };
}

module.exports = { buildContainer };