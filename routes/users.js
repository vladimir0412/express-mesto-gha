const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, getUserInfo, editUser, editAvatar,
} = require('../controllers/users'); // данные нужны для роутинга, поэтому импортируем их

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.get('/users/me', getUserInfo);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);

router.patch('/users/me/avatar', editAvatar);

module.exports = router; // экспортировали роутер
