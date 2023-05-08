const { celebrate, Joi } = require('celebrate');

const urlRegExp = /^(http|https):\/\/(www\.)?[a-zA-Z0-9\S)]#?/;

const validateCreateCard = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegExp),
  }),
});

const validateDeleteCard = () => celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateLikeCard = () => celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateDislikeCard = () => celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateGetUserById = () => celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const validateUpdateProfile = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdateAvatar = () => celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string().required().pattern(urlRegExp),
  }),
});

const validateSignin = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignup = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateCreateCard,
  validateDeleteCard,
  validateLikeCard,
  validateDislikeCard,
  validateGetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateSignin,
  validateSignup,
};
