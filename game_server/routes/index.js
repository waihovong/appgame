var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/game', function(req, res, next) {
  console.log('NEW PLAYER HAS JOINED');
  res.sendStatus(200);
});


module.exports = app;
