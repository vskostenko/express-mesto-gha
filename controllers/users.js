const http2 = require('http2');
const User = require('../models/user');

const createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

const getUsers = (req, res) => {
  console.log(req.body);
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' }));
};

const getUserByid = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден. Несуществующий id.');
      error.statusCode = http2.constants.HTTP_STATUS_NOT_FOUND;
      error.name = 'NotFound';
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден. Некорректный id' });
      } else if (err.name === 'NotFound') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

const updateProfile = (req, res) => {
  console.log(req.body);
  const { name, about } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then(() => {
      res.status(http2.constants.HTTP_STATUS_OK).send({ name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

const updateAvatar = (req, res) => {
  console.log(req.body);
  const { avatar } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

module.exports = {
  createUser,
  updateProfile,
  updateAvatar,
  getUsers,
  getUserByid,

};
