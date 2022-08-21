const BadRequest = 400;
const ServerError = 500;
const NotFound = require('../errors/NotFound');
const Card = require('../models/card');

const getCards = (req, res) => {
  const {
    name, link, owner, likes, createdAt,
  } = req.body;

  Card.find({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Произошла ошибка при получении карточек' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Произошла ошибка при создании карточки' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ card }))
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ card }))
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ card }))
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

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
