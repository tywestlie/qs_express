
exports.seed = function(knex, Promise) {
  return knex('meals').del()
    .then(function () {
      return knex('meals').insert([
        {id: 1, name: 'Breakfast'},
        {id: 2, name: 'Snack'},
        {id: 3, name: 'Lunch'},
        {id: 4, name: 'Dinner'}
      ]);
    });
};
