const ServerError = require('../errors/ServerError');

const handler = ((error, req, res, next) => {
  if (error.statusCode) {
    res.status(error.statusCode).send({ message: error.message });
  } else {
    res.status(ServerError).send({ message: 'Произошла ошибка' });
  }
  next();
});

module.exports = { handler };
