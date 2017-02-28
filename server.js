'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('./morgan-custom/index.js');

app.use(morgan('dev'));

const logs = require('./routes/logs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use('/logs',logs);


////// WILDCARD ROUTE
app.use('*', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')})
})

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.log(err)
  res.status(err.status || 500)
  res.json(err)
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Listening on http://localhost:'+ port);
});

module.exports = app;
