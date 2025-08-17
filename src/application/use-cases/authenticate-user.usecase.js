const { InvalidCredentialsError, ValidationError } = require('../../domain/errors/domain-errors')

function makeAuthenticateUser({ userRepository, hashService, tokenService, jwtTtl = '2h' }) {
    if (!userRepository || !hashService || !tokenService) {
        throw new Error('Missing one or more required dependencies: userRepository, hashService, tokenService');
    }

    return {
        /**
         * @param {{ email: string, password: string }} input
         * @returns {Promise<{ token: string, user: { id: string, name: string, email: string, type: string }}>}
         */
        async execute({ email, password }) {
            if (!email || !password) {
                throw new ValidationError('email and password are required');
            }

            const user = await userRepository.findByEmail(email);
            if (!user) throw new InvalidCredentialsError();

            const ok = await hashService.compare(password, user.passwordHash)
            if (!ok) throw new InvalidCredentialsError();

            const payload = { sub: user.id, email: user.email, type: user.type };
            const token = await tokenService.sign(payload, jwtTtl);

            const safeUser = { id: user.id, name: user.name, email: user.email, type: user.type };
            return { token, user: safeUser };
        }
    };
}

module.exports = { makeAuthenticateUser };