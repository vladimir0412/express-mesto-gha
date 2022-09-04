const { UnauthorizedCode } = require('./statusCodes');

module.exports = class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UnauthorizedCode;
  }
};
