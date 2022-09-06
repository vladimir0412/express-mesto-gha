const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, getUserInfo, editUser, editAvatar,
} = require('../controllers/users'); // данные нужны для роутинга, поэтому импортируем их

router.get('', getUsers);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i),
  }),
}), editAvatar);

module.exports = router; // экспортировали роутер
