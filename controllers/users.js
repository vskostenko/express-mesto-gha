const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { celebrate, Joi } = require('celebrate');
const User = require('../models/user');
const { send } = require('process');
const NotFoundError = require('../errors/not_found');
const BadRequestError = require('../errors/bad_request');
const AnauthorizedError = require('../errors/anauthorized');
const ConflictError = require('../errors/conflict');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newUser);
    })
    .catch((err) => {
      console.log('ошибка');
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с этим электронным адресом уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

const getUserByid = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден. Некорректный id'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  console.log(req.body);
  const { name, about } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send({ name, about });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  console.log(req.body);
  const { avatar } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      console.log(user);
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => next(err));
};

const getMyProfile = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден. Несуществующий id.');
      error.statusCode = http2.constants.HTTP_STATUS_NOT_FOUND;
      error.name = 'NotFound';
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь по указанному _id не найден. Некорректный id'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  updateProfile,
  updateAvatar,
  getUsers,
  getUserByid,
  login,
  getMyProfile,
};
