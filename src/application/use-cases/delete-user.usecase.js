const { ValidationError } = require('../../domain/errors/domain-errors');

function makeDeleteUser({ userRepository }) {
  if (!userRepository) throw new Error('userRepository required');
  return {
    async execute({ id }) {
      if (!id) throw new ValidationError('id required');
      const ok = await userRepository.delete(id);
      if (!ok) throw new ValidationError('user not found');
      return { ok: true };
    },
  };
}
module.exports = { makeDeleteUser };
