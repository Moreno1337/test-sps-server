const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse({
      body: req.body, params: req.params, query: req.query
    });

    req.body = data.body ?? req.body;

    next();
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).json({ message:'Invalid input', issues: e.issues });
    next(e);
  }
};

module.exports = { validate };
