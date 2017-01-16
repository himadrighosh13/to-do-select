var path            = require("path");
var express         = require("express");
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
var sassMiddleware  = require('node-sass-middleware');

var CONFIG = require('./config/config');

var app = express();

app.use(bodyParser());

//app.use(
//  sassMiddleware({
//    src: path.join(__dirname, 'public'),
//    dest: path.join(__dirname, 'public'),
//    prefix:  '/styles',
//    debug: true
//  })
//);

app.use(express.static(__dirname + '/src'));

//app.use('*', function(req, res) {
//  // Use res.sendfile, as it streams instead of reading the file into memory.
//  res.sendfile(__dirname + '/src/index.html');
//});

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