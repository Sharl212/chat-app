const path = require('path');
const http = require('http');
const express = require('express');
const socketiO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 1;
var app = express();
var server = http.createServer(app);
var io = socketiO(server);

app.use(express.static(publicPath));

io.on('connection',function (socket){
  console.log('new user connected');

  socket.on('disconnect',function (socket){
    console.log('disconnected from server.');
  });

  socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user has joined'));

  socket.on('createMessage', function(message, callback){
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', function(coords){
    io.emit('newLocationMessage', generateLocationMessage(`user`,coords.latitude, coords.longitude));
  });
});

app.get('/', function (req, res, next){
  res.render('index.html')
});

server.listen(port, function(){
  console.log(`server is up on ${port}`);
});
