const AppException = require('./app.exception');

class NotFoundException extends AppException {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundException';
  }
}

module.exports = NotFoundException;
