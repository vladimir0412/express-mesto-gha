const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFound = require('../errors/NotFound');
const User = require('../models/user');

const BadRequest = 400;
const ServerError = 500;
const ConflictError = 409;

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Пользователь не найден' });
    });
};

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

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
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

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные для создании пользователя'));
      } else {
        next(error);
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
  login, getUsers, getUserById, getUserInfo, createUser, editUser, editAvatar,
};
