const AppException = require('./app.exception');

class ValidationException extends AppException {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400, errors);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationException;
