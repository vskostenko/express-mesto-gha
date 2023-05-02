const http2 = require('http2');
const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена!' });
  next();
});

module.exports = router;
