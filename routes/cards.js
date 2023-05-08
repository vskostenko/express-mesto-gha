const cardsRouter = require('express').Router();
const {
  validateCreateCard, validateDeleteCard, validateLikeCard, validateDislikeCard,
} = require('../middlewares/requestvalidator');

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.post('/', validateCreateCard(), createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:id', validateDeleteCard(), deleteCard);
cardsRouter.put('/:id/likes', validateLikeCard(), likeCard);
cardsRouter.delete('/:id/likes', validateDislikeCard(), dislikeCard);

module.exports = cardsRouter;
