const cardsRouter = require('express').Router();
const {
  createCard, getCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.post('/', createCard);
cardsRouter.get('/', getCards);
cardsRouter.get('/:id', getCard);
cardsRouter.delete('/:id', deleteCard);
cardsRouter.put('/:id/likes', likeCard);
cardsRouter.delete('/:id/likes', dislikeCard);

module.exports = cardsRouter;
