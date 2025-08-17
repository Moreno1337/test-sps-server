function makeAuthController({ authenticateUser }) {
    if (!authenticateUser || typeof authenticateUser.execute !== 'function') {
        throw new Error('authenticate use case is required');
    }

    return {
        async login(req, res, next) {
            try {
                const { email, password } = req.body || {};

                if (!email || !password) {
                    return res.status(400).json({ message: 'email and password are required' });
                }

                const { token, user } = await authenticateUser.execute({ email, password });

                return res.status(200).json({ token, user });
            } catch (err) {
                if (err?.name === 'InvalidCredentialsError') {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }

                if (err?.name === 'ValidationError') {
                    return res.status(400).json({ message: err.message, issues: err.issues });
                }

                return next(err);
            }
        }
    };
}

module.exports = { makeAuthController };