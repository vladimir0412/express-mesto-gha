const ApplicationError = require('./ApplicationError');

module.exports = class notFound extends ApplicationError {
  constructor() {
    super(404, 'Пользователь не найден');
  }
}

