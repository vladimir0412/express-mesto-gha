const router = require('express').Router(); // создали роутер
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards'); // данные нужны для роутинга, поэтому импортируем их

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router; // экспортировали роутер
