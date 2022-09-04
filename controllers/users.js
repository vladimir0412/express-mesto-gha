const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const CreatedCode = require('../errors/statusCodes');
const Conflict = require('../errors/Conflict');
const ServerError = require('../errors/ServerError');
const User = require('../models/user');

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
      res.status(Unauthorized).send({ message: 'Пользователь не найден' });
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

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден.');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Пользователь не найден.'));
      } else {
        next(error);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь не найден.');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Пользователь не найден.'));
      } else {
        next(error);
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
    .then((user) => {
      const data = {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };
      res.status(CreatedCode).send(data);
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new Conflict('Такой пользователь уже существует'));
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
