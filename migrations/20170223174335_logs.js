'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('logs', function(table) {
    table.increments().notNullable(); // id
    table.string('remote_address');
    table.string('remote_user');
    table.string('method');
    table.string('url');
    table.integer('status');
    table.integer('response_length');
    table.integer('response_time');
    table.timestamps(true, true);
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('logs');
};
