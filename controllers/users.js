const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const NotFoundError = require('../errors/not_found');
const BadRequestError = require('../errors/bad_request');
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
      res.status(http2.constants.HTTP_STATUS_CREATED).send({
        _id: newUser._id,
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
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
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUserByid = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
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
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан невалидный id'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        // создадим токен
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
        // вернём токен
        return res.send({ token });
      }
      return next();
    })
    .catch((err) => {
      next(err);
    });
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
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
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
