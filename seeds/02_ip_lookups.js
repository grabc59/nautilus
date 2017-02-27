'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ip_lookups').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('ip_lookups').insert(
          {
            id: 1,
            logs_id: 1,
            country: "United States",
            region_name: "California",
            city: "San Francisco",
            zip: "1111",
            lat: "37.7898",
            lon: "-122.3942",
            created_at: '2017-01-26T14:26:16.000Z',
            updated_at: '2017-01-26T14:26:16.000Z'
          }),
        knex('ip_lookups').insert(
          {
            id: 2,
            logs_id: 2,
            country: "United States",
            region_name: "Florida",
            city: "Miami",
            zip: "2222",
            lat: "80.1918",
            lon: "25.7617",
            created_at: '2017-01-27T14:26:16.000Z',
            updated_at: '2017-01-27T14:26:16.000Z'
          }),
        knex('ip_lookups').insert(
          {
            id: 3,
            logs_id: 3,
            country: "United States",
            region_name: "Alaska",
            city: "Anchorage",
            zip: "3333",
            lat: "61.2181",
            lon: "149.9003",
            created_at: '2017-01-28T14:26:16.000Z',
            updated_at: '2017-01-28T14:26:16.000Z'
          }),
      ])
      .then(() => {
        return knex.raw(
          "SELECT setval('ip_lookups_id_seq', (SELECT MAX(id) FROM ip_lookups));"
        );
      });
    });
};
