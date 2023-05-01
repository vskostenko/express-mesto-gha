const usersRouter = require('express').Router();

const {
  createUser, getUsers, updateProfile, updateAvatar, getUserByid,
} = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserByid);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
