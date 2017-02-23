'use strict';
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/nautilus_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/nautilus_test'
  }
};
