const { createUser, getUsers, updateProfile,updateAvatar, getUserByid } = require('../controllers/users');

const usersRouter = require('express').Router();

usersRouter.post ('/', createUser);
usersRouter.get ('/', getUsers);
usersRouter.get ('/:id', getUserByid);
usersRouter.patch ('/me', updateProfile);
usersRouter.patch ('/me/avatar', updateAvatar);


module.exports = usersRouter;