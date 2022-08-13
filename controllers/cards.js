const Card = require('../models/card');
const NotFound = require('../errors/NotFound');

const getCards = (req, res) => {
  const { name, link, owner, likes, createdAt } = req.body;

  Card.find({ name, link, owner, likes, createdAt })
    .then((card) => res.status(200).send({ card }))
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка при получении карточек ${error}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` })
      }
    }
  );
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка при создании карточки ${error}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` })
      }
    }
  );
};

const deleteCardById = (req, res) => {

  Card.findByIdAndRemove(req.params.cardId )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.status(200).send({ card }))
    .catch((error) => {
      if(error.name === 'NotFound') {
        res.status(error.status).send(error);
      } else if (error.name === 'CastError') {
        res.status(400).send({ message: `Произошла ошибка: некорректные данные id ${error}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` });
      }
    }
  );
};

const likeCard = (req, res) => {

  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(200).send({ card }))
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка идентификации пользователя ${error}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` })
      }
    }
  );
};

const dislikeCard = (req, res) => {

  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send({ card }))
    .catch((error) => {
      if(error.name === 'ValidationError') {
        res.status(400).send({ message: `Произошла ошибка идентификации пользователя ${error}` })
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера ${error}` })
      }
    }
  );
};

module.exports = { getCards, createCard, deleteCardById, likeCard, dislikeCard };