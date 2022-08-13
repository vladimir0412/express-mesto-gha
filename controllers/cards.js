const Card = require('../models/card');

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

  Card.findById(req.params.userId )
    .then((card) => res.status(200).send({ card }))
    .catch((error) =>
      res.status(404).send({ message: `Карточка не найдена ${error}` })
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