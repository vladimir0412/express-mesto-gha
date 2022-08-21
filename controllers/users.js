const NotFound = require('../errors/NotFound');
const User = require('../models/user');

const BadRequest = 400;
const ServerError = 500;

const getUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.find({ name, about, avatar })
    .then((users) => res.send({ users }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'NotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Произошла ошибка: некорректные данные id' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Произошла ошибка при создании пользователя' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'NotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Произошла ошибка при редактировании профиля' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => res.send({ user }))
    .catch((error) => {
      if (error.name === 'NotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Произошла ошибка при смене аватара' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, editUser, editAvatar,
};
