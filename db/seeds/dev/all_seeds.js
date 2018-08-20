exports.seed = function(knex, Promise) {
  return knex('meal_foods').del()
    .then(() => knex('meals').del())
    .then(() => knex('foods').del())
    .then(() => {
      return Promise.all([
        knex('foods').insert([
          {id: 1, name: 'Slim Jim', calories: 500},
          {id: 2, name: 'Apple', calories: 50},
          {id: 3, name: 'Cupcake', calories: 200},
          {id: 4, name: 'Egg', calories: 90},
          {id: 5, name: 'Development Sugar Cubes', calories: 1200}
        ])
        .then(() => {
          return knex('meals').insert([
            {id: 1, name: 'Breakfast'},
            {id: 2, name: 'Snack'},
            {id: 3, name: 'Lunch'},
            {id: 4, name: 'Dinner'}
          ])
        })
        .then(() => {
          return knex('meal_foods').insert([
            {id: 1, meal_id: 1, food_id: 1},
            {id: 2, meal_id: 2, food_id: 2},
            {id: 3, meal_id: 3, food_id: 3},
            {id: 4, meal_id: 4, food_id: 4}
          ]);
        })
      ])
    })
  }
