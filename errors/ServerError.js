const { ServerErrorCode } = require('./statusCodes');

module.exports = class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ServerErrorCode;
  }
};
