var path            = require("path");
var express         = require("express");
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
var sassMiddleware  = require('node-sass-middleware');

var oneDay = 86400000;

var CONFIG = require('./config/config');

var app = express();

app.use(bodyParser());

app.use(function(req, res, next) {
  res.setHeader("Cache-Control", "public, max-age=3600");
  return next();
});

app.use(express.static(__dirname + '/src'));

app.use(express.static(__dirname + '/public'));

app.get(/^(?!api).*/, function(req, res) {
  res.sendFile(path.join(__dirname, './src/index.html'));
});

app.listen(CONFIG.PORT, CONFIG.HOST, function(err, res) {
  if(err) {
    console.log("Problem while starting the server!!!")
    console.log(err);
  }

  console.log('\nListening at http://'+CONFIG.HOST+':'+CONFIG.PORT+'\n');
});