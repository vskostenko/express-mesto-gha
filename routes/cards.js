const { createCard, getCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

const cardsRouter = require('express').Router();

cardsRouter.post ('/', createCard);
cardsRouter.get ('/:id', getCard);
cardsRouter.delete ('/:id', deleteCard);
cardsRouter.put ('/:id/likes', likeCard);
cardsRouter.delete ('/:id/likes', dislikeCard);

module.exports = cardsRouter;