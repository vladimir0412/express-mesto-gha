const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Card = require('../models/card');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Карточка не найдена.'));
      } else {
        next(error);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Несуществующий id карточки');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        throw new Forbidden('Невозможно удалить карточку');
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Карточка не найдена.'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Несуществующий id карточки');
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Карточка не найдена.'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Несуществующий id карточки');
    })
    .then((card) => res.send(card))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest('Карточка не найдена.'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
