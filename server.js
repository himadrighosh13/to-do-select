
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var CONFIG = require('./config/config')

var app = express();

app.use(express.static(__dirname + '/src'));

app.listen(CONFIG.PORT, CONFIG.HOST, function(err, res) {
  console.log(arguments);
});
