const usersRouter = require('express').Router();

const {
  getUsers, updateProfile, updateAvatar, getUserByid, getMyProfile, createUser,
} = require('../controllers/users');
const {
  validateGetUserById, validateUpdateProfile, validateUpdateAvatar,
} = require('../middlewares/requestvalidator');

usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.get('/me', getMyProfile);
usersRouter.get('/:id', validateGetUserById(), getUserByid);
usersRouter.patch('/me', validateUpdateProfile(), updateProfile);
usersRouter.get('/me', getMyProfile);
usersRouter.patch('/me/avatar', validateUpdateAvatar(), updateAvatar);

module.exports = usersRouter;
