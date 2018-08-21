var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', function(req, res, next){
  database('meals').select()
  .then((meals) => {
    let allMeals = meals.map((meal) => {
      return database('foods').select('foods.id', 'foods.name', 'foods.calories')
      .innerJoin('meal_foods', 'foods.id', 'meal_foods.food_id')
      .where('meal_foods.meal_id', meal.id)
      .then((foods) => {
        meal['foods'] = foods;

        return meal;
      })
    })
    return Promise.all(allMeals)
  })
  .then((meals) => {
    res.status(200).json(meals)
  })
});

router.get('/:id/foods', function(req, res, next){
  database('meals').where('id', req.params.id).select()
  .then((meal) => {
    let singleMeal = meal.map((meal) => {
      return database('foods').select('foods.id', 'foods.name', 'foods.calories')
      .innerJoin('meal_foods', 'foods.id', 'meal_foods.food_id')
      .where('meal_foods.meal_id', meal.id)
      .then((foods) => {
        meal['foods'] = foods;

        return meal;
      })
    })
    return Promise.all(singleMeal)
  })
  .then((meal) => {
    res.status(200).json(meal);
  })
});

router.post('/:meal_id/foods/:id', function(req, res, next){
  let foodId = req.params.id;
  let mealId = req.params.meal_id;
  database('meal_foods').insert({meal_id: mealId, food_id: foodId})
  .then(food => {
    res.status(201).json({ id: food[0] })
  })
});

router.delete('/:meal_id/foods/:id', function(req, res, next){
  database('meal_foods').where('food_id', req.params.id).del()
    .then((success) => {
      res.status(204).json({message: "Deleted!"})
    })
});




module.exports = router;
