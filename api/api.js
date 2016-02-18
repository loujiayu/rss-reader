// Module dependencies
var path     = require('path');
var fs       = require('fs');
var express  = require('express');
var mongoose = require('mongoose');
// var passport = require('passport');
var config   = require(__dirname + '/config/config');
var app      = express();

import apiConfig from '../src/config';

if(process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  // app.use(require('express-enforces-ssl')());
}

app.config = config;

// Database
require('./config/database')(app, mongoose);

var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
});

// require('./config/passport')(app, passport);

// express settings
require('./config/express')(app, express);

// create a server instance
// passing in express app as a request event handler
app.listen(apiConfig.apiPort, function() {
  console.log("\n✔ Express server listening on port %d in %s mode", apiConfig.apiPort, app.get('env'));
});
// app.listen(3001, function() {
//   console.log("\n✔ Express server listening on port 3001 in %s mode", app.get('env'));
// });

module.exports = app;
