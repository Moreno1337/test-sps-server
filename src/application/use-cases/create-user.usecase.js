const { ValidationError, EmailInUseError } = require('../../domain/errors/domain-errors');
const { randomUUID } = require('crypto');

function makeCreateUser({ userRepository, hashService }) {
  if (!userRepository || !hashService) throw new Error('missing required dependencies');

  return {
    /**
     * @param {{ name: string, email: string, type: string, password: string }} input
     * @returns {id: randomUUID, name: string, email: string, type: string}
     */
    async execute({ name, email, type, password }) {
      if (!email || !password || !name || !type) throw new ValidationError('name, email, type and password are required');

      const existing = await userRepository.findByEmail(email);
      if (existing) throw new EmailInUseError();

      const passwordHash = await hashService.hash(password);
      const user = await userRepository.create({
        id: randomUUID(),
        name, email, type,
        passwordHash,
      });

      return { id: user.id, name: user.name, email: user.email, type: user.type };
    },
  };
}

module.exports = { makeCreateUser };
