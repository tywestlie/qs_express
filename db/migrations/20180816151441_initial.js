
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('meals', function(table) {
      table.increments('id').primary();
      table.string('name');
    }),

    knex.schema.createTable('foods', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.integer('calories');
    }),

    knex.schema.createTable('meal_foods', function(table) {
      table.increments('id').primary();
      table.integer('meal_id').references('id').inTable('meals').notNull()
      table.integer('food_id').references('id').inTable('foods').notNull()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
     knex.schema.dropTable('meal_foods'),
     knex.schema.dropTable('foods'),
     knex.schema.dropTable('meals')
   ]);
};
