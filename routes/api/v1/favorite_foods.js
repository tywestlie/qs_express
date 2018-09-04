var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', function(req, res, next){
    database.raw(
      `SELECT timesEaten, json_agg(json_build_object('name', name, 'calories', calories, 'mealsWhenEaten', meals))  AS foods
      FROM(
        SELECT foods.name, foods.calories, COUNT(foods.id) AS timesEaten, array_agg(DISTINCT meals.name) AS meals
        FROM foods
        INNER JOIN meal_foods ON foods.id = meal_foods.food_id
        INNER JOIN meals ON meals.id = meal_foods.meal_id
        GROUP BY foods.id
        ORDER BY timesEaten DESC
      ) query
      GROUP BY timesEaten
      ORDER BY timesEaten DESC
      LIMIT 5;`
     )
      .then((data) => {
        res.status(201).send(data.rows)
      });
    });


module.exports = router;
