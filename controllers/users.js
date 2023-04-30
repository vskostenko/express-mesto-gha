const User = require ('../models/user');

const createUser = ( req, res ) => {
  console.log(req.body);
  const { name, about, avatar} = req.body;
  User.create ({ name, about, avatar})
  .then ((newUser) => {
    res.status(201).send(newUser)
  })
  .catch ((err)=> {
  if (err.name === "ValidationError") {
    res.status(400).send({message: `Переданы некорректные данные при создании пользователя.${err}`})
  } else {
    res.status(500).send({message: `Ошибка по умолчанию.${err}`})
  }
  })
}

const getUsers = ( req, res ) => {
  console.log(req.body);
  User.find()
  .then ((users) => res.send(users))
  .catch ((err)=>
  res.status(500).send({message: `Ошибка по умолчанию.${err}`})
  )
}

const getUserByid = ( req, res ) => {
  const { id } = req.params;
  User.findById(id)
  .then ((user) => res.send(user))
  .catch ((err)=> {
  if ( err.name === 'CastError' ) {
    res.status(400).send({message: 'Пользователь по указанному _id не найден.'})
  } else {
    res.status(500).send({message: `Ошибка по умолчанию.${err}`})
  }
  })
}

const updateProfile = ( req, res ) => {
  console.log(req.body);
  const { name, about} = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(userId,{ name, about },{ new: true, runValidators: true })
  .then (() => {
    res.status(200).send({ name, about });
  })
  .catch ((err)=>
  {
    if ( err.name === 'ValidationError' ) {
      res.status(400).send({message: `Переданы некорректные данные при обновлении профиля.${err.message}`})
    } else {
      res.status(404).send({message: `Пользователь с указанным _id не найден.${err}`})
      res.status(500).send({message: `internal server error ${err}`})
    }
    }
  )
}

const updateAvatar = ( req, res ) => {
  console.log(req.body);
  const { avatar } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(userId, { avatar })
  .then ((user) => {
    res.send(user)
  })
  .catch ((err)=>
  {
    if ( err.name === 'ValidationError' ) {
      res.status(400).send({message: `Not valid user data ${err.message}`})
    } else {
      res.status(500).send({message: `internal server error ${err}`})
    }
  })
}

module.exports = {
  createUser,
  updateProfile,
  updateAvatar,
  getUsers,
  getUserByid,

}