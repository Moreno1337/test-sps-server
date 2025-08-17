require('dotenv').config();

const env = getEnv();

function getEnv() {
    const port = process.env.PORT || 3000;
    const jwtSecret = process.env.JWT_SECRET;
    const jwtTtl = process.env.JWT_TTL || '2h';

    if (!jwtSecret) throw new Error('No JWT_SECRET defined at .env file');

    return {
        PORT: port,
        JWT_SECRET: jwtSecret,
        JWT_TTL: jwtTtl
    };
}

module.exports = { env };
