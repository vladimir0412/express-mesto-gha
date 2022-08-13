const ApplicationError = require('./ApplicationError');

module.exports = class NotFound extends ApplicationError {
  constructor() {
    super(404, 'Объект запроса не найден');
  }
}

