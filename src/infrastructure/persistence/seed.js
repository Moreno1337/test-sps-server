const { randomUUID } = require('crypto');
const { makeBcryptHashService } = require('../security/bcrypt-hash.service');

async function seedAdmin(userRepo) {
  const email = 'admin@sps.com';
  const exists = await userRepo.findByEmail(email);
  if (exists) return exists;

  const hashService = makeBcryptHashService();
  const passwordHash = await hashService.hash('admin123');

  const admin = await userRepo.create({
    id: randomUUID(),
    name: 'Admin',
    email,
    type: 'admin',
    passwordHash,
  });
  return admin;
}

module.exports = { seedAdmin };