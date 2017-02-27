'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('ip_lookups', function(table) {
    table.increments().notNullable(); // id
    table.integer('logs_id').references('logs.id').onDelete('CASCADE');;
    table.string('country');
    table.string('region_name');
    table.string('city');
    table.string('zip');
    table.string('lat');
    table.string('lon');
    table.string('isp');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ip_lookups');
};
