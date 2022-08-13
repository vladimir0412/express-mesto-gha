const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');

const getUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  User.find({ name, about, avatar })
    .then((users) => res.status(200).send({ users }))
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(400).send({ message: `Запрашиваемый пользователь не найден ${error}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` });
      }
    }
  );
};

const getUserById = (req, res) => {

  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ user }))
    .catch((error) => {
      if(error.name === 'UserNotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка: некорректные данные id ${error}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` });
      }
    }
  );
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка при создании пользователя ${error}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` });
      }
    }
  );
};

const editUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { name, about }, {new: true, runValidators: true, upset: false,
    },
  )
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ user }))
    .catch((error) => {
      if(error.name === 'UserNotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка при редактировании профиля ${error}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` });
      }
    }
  );
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar }, {new: true, runValidators: true, upset: false,
    },
  )
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => res.status(200).send({ user }))
    .catch((error) => {
      if(error.name === 'UserNotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка при смене аватара ${error}` })
      } else {;
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` });
      }
    }
  );
};

module.exports = { getUsers, getUserById, createUser, editUser, editAvatar };