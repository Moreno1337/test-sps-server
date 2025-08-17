function makeUsersController({ createUser, listUsers, updateUser, deleteUser }) {
  if (!createUser || !listUsers || !updateUser || !deleteUser) throw new Error('missing required use cases');

  return {
    // POST /users
    async create(req, res, next) {
      try {
        const user = await createUser.execute(req.body || {});
        return res.status(201).json(user);
      } catch (err) {
        if (err?.name === 'EmailInUseError') return res.status(400).json({ message: err.message });
        if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message, issues: err.issues });
        return next(err);
      }
    },

    // GET /users
    async list(_, res, next) {
      try {
        const users = await listUsers.execute();
        return res.status(200).json(users);
      } catch (err) { return next(err); }
    },

    // PUT /users/:id
    async update(req, res, next) {
      try {
        const id = req.params.id;
        const user = await updateUser.execute({ id, ...req.body });
        return res.status(200).json(user);
      } catch (err) {
        if (err?.name === 'EmailInUseError') return res.status(400).json({ message: err.message });
        if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
        return next(err);
      }
    },

    // DELETE /users/:id
    async remove(req, res, next) {
      try {
        const id = req.params.id;
        await deleteUser.execute({ id });
        return res.status(204).send();
      } catch (err) {
        if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
        return next(err);
      }
    },
  };
}

module.exports = { makeUsersController };
