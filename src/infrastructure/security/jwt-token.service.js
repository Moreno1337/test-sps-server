const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function makeJwtTokenService(secret = env.JWT_SECRET) {
  return {
    async sign(payload, expiresIn = env.JWT_TTL) {
      return jwt.sign(payload, secret, { expiresIn });
    },
    async verify(token) {
      return jwt.verify(token, secret);
    },
  };
}

module.exports = { makeJwtTokenService };