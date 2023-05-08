const http2 = require('http2');
const Card = require('../models/card');
const NotFoundError = require('../errors/not_found');
const BadRequestError = require('../errors/bad_request');
const ForbiddenError = require('../errors/forbidden');

const createCard = (req, res, next) => {
  const userId = req.user._id;
  const {
    name, link, likes, createdAt,
  } = req.body;
  Card.create({
    name, link, owner: userId, likes, createdAt,
  })
    .then((newCard) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  Card.findById(id)
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка по указанному Id не найдена');
      if (userId !== card.owner._id.toString()) throw new ForbiddenError('Недостаточно прав для удаления карточки');
      return card.deleteOne();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка по указанному Id не найдена');
      return res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка по указанному Id не найдена');
      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
