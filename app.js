const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { id: '644c07022eba66f63001e9b8' };
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(router);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена!' });
  next();
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
