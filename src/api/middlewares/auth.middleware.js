function makeAuthMiddleware({ tokenService }) {
  if (!tokenService) throw new Error('tokenService is required');

  return async function authMiddleware(req, res, next) {
    try {
      const h = req.headers.authorization || '';
      const token = h.startsWith('Bearer ') ? h.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const payload = await tokenService.verify(token);
      req.user = payload;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.type !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { makeAuthMiddleware };
module.exports.requireRole = requireRole;