const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified Self';

// root
app.get('/', (request, response) => {
  response.send('Welcome to Quantified Self With Express!');
});

// index
app.get('/api/v1/foods', (request, response) => {
  database('foods').select()
  .then((foods) => {
    response.status(200).json(foods);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

// show
app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).select()
    .then(foods => {
      if (foods.length) {
        response.status(200).json(foods);
      } else {
        response.status(404).json({
          error: `Could not find food with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//post
app.post('/api/v1/foods', (request, response) => {
  const food = request.body.params;
  database('foods').insert(food, 'id')
    .then(food => {
      response.status(201).json({ id: food[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


app.get('/api/v1/meals', (request, response) => {
  database('meals').select()
    .then((meals) => {
      response.status(200).json(meals);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
