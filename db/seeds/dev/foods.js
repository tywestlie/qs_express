
exports.seed = function(knex, Promise) {
  return knex('foods').del()
    .then(function () {
      return knex('foods').insert([
        {id: 1, name: 'Slim Jim', calories: 500},
        {id: 2, name: 'Apple', calories: 50},
        {id: 3, name: 'Cupcacke', calories: 200},
        {id: 4, name: 'Egg', calories: 90}
      ]);
    });
};
