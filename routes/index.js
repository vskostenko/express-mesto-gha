const http2 = require('http2');
const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateSignin, validateSignup } = require('../middlewares/requestvalidator');

router.use('/signup', validateSignup(), createUser);
router.use('/signin', validateSignin(), login);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('*', (req, res, next) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена!' });
  next();
});

module.exports = router;
