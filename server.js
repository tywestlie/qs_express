require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const foodRouter = require('./routes/api/v1/foods');
const mealRouter = require('./routes/api/v1/meals');
const ffRouter = require('./routes/api/v1/favorite_foods');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';
app.use(cors())

app.use('/', indexRouter);
app.use('/api/v1/foods', foodRouter);
app.use('/api/v1/meals', mealRouter);
app.use('/api/v1/favorite_foods', ffRouter);


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
