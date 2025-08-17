const { z } = require('zod');

const email = z.email().transform(v => v.toLowerCase().trim());
const password = z.string().min(5);
const type = z.enum(['admin','user']);
const name = z.string().min(1).max(100).transform(s => s.trim());

const LoginSchema = z.object({ body: z.object({ email, password }) });
const CreateUserSchema = z.object({ body: z.object({ name, email, type, password }) });
const UpdateUserSchema = z.object({ body: z.object({
  name: name.optional(), email: email.optional(), type: type.optional(), password: password.optional()
})});

module.exports = { LoginSchema, CreateUserSchema, UpdateUserSchema };
