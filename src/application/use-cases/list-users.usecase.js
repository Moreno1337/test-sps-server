function makeListUsers({ userRepository }) {
  if (!userRepository) throw new Error('userRepository required');
  return {
    async execute() {
      const users = await userRepository.list();
      return users.map(u => ({ id: u.id, name: u.name, email: u.email, type: u.type }));
    },
  };
}

module.exports = { makeListUsers };