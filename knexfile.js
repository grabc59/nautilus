'use strict';
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/nautilus_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/nautilus_test'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
