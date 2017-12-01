'use strict';

const express = require('express');
const fs = require('fs');
const config = require('config');
const app = express();
const bodyParser = require('body-parser');
const validator = require('express-validator');

// body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator({}));

app.set('views', './views');
app.set('view engine', 'ejs');

// import routers
app.use(require('./apis'));
app.use('/assets', express.static('./build'));
app.use('/', function(req, res) {
  res.render('app');
});

// start server
const server = app.listen(config.get('server.port'), config.get('server.host'), function () {
  const host = server.address().address;
  const port = server.address().port;
  console.info('Server start at http://%s:%s', host, port);
});

module.exports = app;
