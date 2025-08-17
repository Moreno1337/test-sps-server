const users = new Map();

function makeInMemoryUserRepository() {
  return {
    async findByEmail(email) {
      for (const u of users.values()) if (u.email === email) return { ...u };
      return null;
    },
    async findById(id) {
      const u = users.get(id);
      return u ? { ...u } : null;
    },
    async create({ id, name, email, type, passwordHash }) {
      for (const u of users.values()) {
        if (u.email === email) {
          const err = new Error('E-mail already in use');
          err.name = 'EmailInUseError';
          throw err;
        }
      }
      const user = { id, name, email, type, passwordHash, createdAt: new Date().toISOString() };
      users.set(user.id, user);
      return { ...user };
    },
    async list() {
      return Array.from(users.values()).map(u => ({ ...u }));
    },
    async update(id, data) {
      const u = users.get(id);
      if (!u) return null;
      const updated = { ...u, ...data };
      users.set(id, updated);
      return { ...updated };
    },
    async delete(id) {
      return users.delete(id);
    },
    _raw: users,
  };
}

module.exports = { makeInMemoryUserRepository };