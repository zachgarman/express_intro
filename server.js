var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


var app = express();


// middleware function, gets executed on each request
app.use(function(req, res, next){
  // console.log('Got a request!');
  next();
});

// middleware for parsing the body and turing it into a JS object
app.use(bodyParser.urlencoded({extended: true}));       // take this function and apply to all req

app.post('/', function(req, res) {
  console.log('req.body: ', req.body);
  res.sendStatus(200);
});

app.get('/', function(req, res) {
  console.log('Received a request at', new Date());
  // __dirname is the folder this file lives in
  var fileName = path.join(__dirname, 'public/views/index.html');
  console.log('filename:', fileName);
  res.sendFile(fileName);
});

app.get('/kittens', function (req, res) {
  console.log('Query params:', req.query);
  if (req.query.age > 2) {
    res.send('MEOW!');
  } else {
    res.send('meow');
  }
});

var songs = [];
var songTracker = 0;
app.post('/songs', function (req, res) {

  //First, find any song matches.
  var unique = true;
  songs.forEach(function (song) {
    if (req.body.artist.toLowerCase().trim() == song.artist.toLowerCase().trim() && req.body.title.toLowerCase().trim() == song.title.toLowerCase().trim()) {
      unique = false;
    }
  });

  if (unique) {
    var date = new Date;
    songTracker++;
    req.body.date = date.toDateString();
    req.body.index = songTracker;
    req.body.remover = '<button id="' + songTracker + '">Remove</button>';
    songs.push(req.body);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.delete('/songs', function(req, res) {
  for (var i = 0; i < songs.length; i++) {
    if (songs[i]['index'] == req.body.index) {
      songs.splice(i, 1);
    }
  }
});

app.get('/songs', function(req, res) {
  res.send(songs);
});

// middleware for serving static files
app.use(express.static('public'));      // this path is relative to where the node is running

app.listen(3000);
