var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

require("isomorphic-fetch")
const APP_ID = process.env.APP_ID;
const APP_KEY = process.env.APP_KEY;

router.get('/', function(req, res, next){
    database('foods').select()
    .then((foods) => {
      res.status(200).json(foods);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  });

router.get('/:id', function(req, res, next){
  database('foods').where('id', req.params.id).select()
  .then(foods => {
    if (foods.length) {
      res.status(200).json(foods);
    } else {
      res.status(404).json({
        error: `Could not find food with id ${req.params.id}`
      });
    }
  })
  .catch(error => {
    res.status(500).json({ error });
  });
});

router.post('/', function(req, res, next){
  let newFood = req.body.food;
  database('foods').insert(newFood)
  .returning(['id', 'name', 'calories'])
  .then(food => {
    return res.status(201).json(food[0])
  });
});

router.patch('/:id', function(req, res, next){
  let attributes = req.body.food
  database('foods')
  .where('id', req.params.id)
  .update({
    'name': attributes.name,
    'calories': attributes.calories
  })
  .then(food => {
    res.status(201).json({ id: food[0], name:attributes.name, calories:attributes.calories })
  })
  .catch(error => {
    res.status(500).json({ error });
  });
});

router.delete('/:id', function(req, res, next){
  database('foods').where('id', req.params.id).del()
  .then((success) => {
    if(success) {
      res.status(204).json({message: "Food Deleted"});
    } else {
      res.status(404).json({message: "Bad Request"});
    }
  });
});

const get_recipes = (food) => {
  return fetch(`http://api.yummly.com/v1/api/recipes?_app_id=${APP_ID}&_app_key=${APP_KEY}&q=${food[0].name}`, {
    headers: {'Content-Type': 'application/json'}
  })
    .then((response) => {
      return response.json()
    })
    .then((recipes) => {
      return recipes.matches.map((recipe) => {
        return { name: recipe.recipeName, url: `http://www.yummly.com/recipe/${recipe.id}` }
      })
    })
};

router.get('/:id/recipes', function(req, res, next){
  database('foods').where('id', req.params.id).select()
  .then((food) => {
    return get_recipes(food)
  })
  .then((data) => {
    res.json({'recipes': data})
  })
})


module.exports = router;
