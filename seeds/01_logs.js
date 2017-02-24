'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('logs').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('logs').insert(
          {
            id: 1,
            remote_address: "1.1.1.1",
            remote_user: null,
            method: "POST",
            url: "/route1",
            status: 200,
            response_length: 1700,
            created_at: '2017-01-26T14:26:16.000Z',
            updated_at: '2017-01-26T14:26:16.000Z'
          }),
        knex('logs').insert(
          {
            id: 2,
            remote_address: "2.2.2.2",
            remote_user: null,
            method: "POST",
            url: "/route2",
            status: 200,
            response_length: 1700,
            created_at: '2017-01-27T14:26:16.000Z',
            updated_at: '2017-01-27T14:26:16.000Z'
          }),
        knex('logs').insert(
          {
            id: 3,
            remote_address: "3.3.3.3",
            remote_user: null,
            method: "POST",
            url: "/route3",
            status: 200,
            response_length: 1700,
            created_at: '2017-01-28T14:26:16.000Z',
            updated_at: '2017-01-28T14:26:16.000Z'
          }),
      ])
      .then(() => {
        return knex.raw(
          "SELECT setval('logs_id_seq', (SELECT MAX(id) FROM logs));"
        );
      });
    });
};
