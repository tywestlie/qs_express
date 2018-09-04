var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', function(req, res, next){
    database.raw(
      `SELECT count(foods.id) AS timesEaten,
       COALESCE(
         json_agg(json_build_object('name', foods.name, 'calories', foods.calories))
         FILTER (WHERE foods.id IS NOT NULL), '[]') AS foods
       FROM meal_foods
       INNER JOIN foods ON meal_foods.food_id = foods.id
       GROUP BY foods.id
       HAVING count(foods.id) > 0
       ORDER BY timesEaten DESC;`
     )
      .then((data) => {
        res.status(201).send(data.rows)
      });
    });


module.exports = router;
