const { ConflictCode } = require('./statusCodes');

module.exports = class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ConflictCode;
  }
};
