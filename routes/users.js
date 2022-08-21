const router = require('express').Router(); // создали роутер
const {
  getUsers, getUserById, createUser, editUser, editAvatar,
} = require('../controllers/users'); // данные нужны для роутинга, поэтому импортируем их

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me', editUser);

router.patch('/users/me/avatar', editAvatar);

module.exports = router; // экспортировали роутер
