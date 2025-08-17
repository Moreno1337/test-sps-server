const { ValidationError, EmailInUseError } = require('../../domain/errors/domain-errors');

function makeUpdateUser({ userRepository, hashService }) {
  if (!userRepository) throw new Error('userRepository required');

  return {
    /**
     * @param { id: randomUUID, name?: string, email?: string, type?: string, password?: string } input
     */
    async execute({ id, name, email, type, password }) {
      if (!id) throw new ValidationError('id required');

      const current = await userRepository.findById(id);
      if (!current) throw new ValidationError('user not found');

      if (email && email !== current.email) {
        const clash = await userRepository.findByEmail(email);
        if (clash && clash.id !== id) throw new EmailInUseError();
      }

      const patch = {};
      if (name !== undefined) patch.name = name;
      if (email !== undefined) patch.email = email;
      if (type !== undefined) patch.type = type;
      if (password) patch.passwordHash = await hashService.hash(password);

      const updated = await userRepository.update(id, patch);
      return { id: updated.id, name: updated.name, email: updated.email, type: updated.type };
    },
  };
}

module.exports = { makeUpdateUser };
