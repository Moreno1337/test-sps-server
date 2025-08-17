const bcrypt = require('bcryptjs');

function makeBcryptHashService(saltRounds = 10) {
  return {
    async hash(plain) { return bcrypt.hash(plain, saltRounds); },
    async compare(plain, hash) { return bcrypt.compare(plain, hash); },
  };
}

module.exports = { makeBcryptHashService };
