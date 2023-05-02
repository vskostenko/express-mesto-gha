const http2 = require('http2');
const Card = require('../models/card');

const createCard = (req, res) => {
  console.log(req.body);
  const { id } = req.user;
  const {
    name, link, likes, createdAt,
  } = req.body;
  Card.create({
    name, link, owner: id, likes, createdAt,
  })
    .then((newCard) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки.${err}` });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' }));
};

const getCard = (req, res) => {
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  console.log(id);
  Card.findByIdAndDelete(id)
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card);
      }
      return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка по указанному Id не найдена' });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Карточка по указанному _id не найдена. Некорректный id' });
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка по указанному Id не найдена' });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Карточка по указанному _id не найдена. Некорректный id' });
      }
      res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка»' });
    });
};

module.exports = {
  createCard,
  getCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
