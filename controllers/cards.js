const Card = require ('../models/card');

const errorCodes = {
  ERROR_INCORECT_DATA_CODE: 400,
  ERROR_NOT_FOUND_CODE: 404,
  ERROR_DEFAULT_CODE: 500,
};

const createCard = (req, res) => {
  console.log(req.body);
  const { id } = req.user;
  const { name, link, owner, likes, createdAt} = req.body;
  Card.create ({ name, link, owner: id, likes, createdAt})
  .then ((newCard) => {
    res.status(201).send(newCard)
  })
  .catch ((err)=> {
    if (err.name === "ValidationError") {
      res.status(400).send({message: `Переданы некорректные данные при создании карточки.${err}`})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка»'})
    }
  })
}

const getCards = (req,res) => {
  Card.find({})
  .then ((cards) => {
    res.send(cards);
  })
  .catch ((err)=>
    res.status(500).send({message: 'На сервере произошла ошибка»'})
  )}


const getCard = (req,res) => {
  const { id } = req.params;
  Card.findById(id)
  .then ((card) => {
    res.send(card);
  })
  .catch ((err)=> {
    if ( err.name === 'CastError' ) {
      res.status(400).send({message: 'Карточка с указанным _id не найдена'})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка»'})
    }}
  )}

const deleteCard = (req,res) => {
  const { id } = req.params;
  console.log(id);
  Card.findByIdAndDelete(id).
  then ((card) => {
    res.status(200).send({message: 'Card deleted'});
  })
  .catch ((err)=> {
    if ( err.name === 'CastError' ) {
      res.status(400).send({message: 'Карточка с указанным _id не найдена'})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка»'})
    }}
  )}

const likeCard = (req, res) => {

  Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
  { new: true }
  )
  .orFail(()=>{
    const error = new Error({message: 'Карточка по указанному _id не найдена. Некорректный id'});
    error.statusCode = 404;
    error.name = "NotFound";
    throw error;
  })
  .then ((card) => {
    res.send(card);
  })
  .catch ((err)=> {
    console.log (err);
    if ( err.name === 'CastError' ) {
      res.status(400).send ({message: 'Карточка по указанному _id не найдена. Некорректный id'});
    } else if (err.name === "NotFound") {
      res.status(404).send({message: 'Карточка по указанному _id не найдена.'})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка»'})
    }
    })
}

const dislikeCard = (req, res) => {

  Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user.id } }, // убрать _id из массива
  { new: true })
  .then ((card) => {
    res.send(card);
    console.log('like');
  })
  .catch ((err)=> {
    if ( err.name === 'ValidationError' ) {
      res.status(400).send({message: `Переданы некорректные данные при удалении лайка.`})
    } else if ( err.name === 'CastError') {
      res.status(404).send({message: `Передан несуществующий _id карточки.`})
    } else {
      res.status(500).send({message: 'На сервере произошла ошибка»'})
    }}
  )}

module.exports = {
  createCard,
  getCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
}