const { ForbiddenCode } = require('./statusCodes');

module.exports = class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ForbiddenCode;
  }
};
