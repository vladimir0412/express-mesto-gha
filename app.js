const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const bodyParser = require('body-parser');
const NotFound = 400;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use((req, res, next) => {
  req.user = {
    _id: '62f668c82fbb27dbbc7a5018'
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('*', (req, res) => {
  res.status(NotFound).send({
    message: 'Страница не найдена',
  });
});

app.listen(3000);
