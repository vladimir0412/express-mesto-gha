const ApplicationError = require('./ApplicationError');

module.exports = class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'Пользователь не найден');
  }
}

