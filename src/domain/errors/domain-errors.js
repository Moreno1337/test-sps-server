class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
  }
}

class ValidationError extends Error {
  constructor(message = 'Invalid data', issues = null) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

class EmailInUseError extends Error {
  constructor() {
    super('E-mail já em uso');
    this.name = 'EmailInUseError';
  }
}

module.exports = {
  InvalidCredentialsError,
  ValidationError,
  EmailInUseError,
};