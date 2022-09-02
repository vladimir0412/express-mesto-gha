const router = require('express').Router(); // создали роутер
const {
  getUsers, getUserById, getUserInfo, editUser, editAvatar,
} = require('../controllers/users'); // данные нужны для роутинга, поэтому импортируем их

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.get('/users/me', getUserInfo);

// router.post('/users', createUser);

router.patch('/users/me', editUser);

router.patch('/users/me/avatar', editAvatar);

module.exports = router; // экспортировали роутер
