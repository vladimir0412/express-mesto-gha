const { BadRequestCode } = require('./statusCodes');

module.exports = class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BadRequestCode;
  }
};
