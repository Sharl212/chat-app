const path = require('path');
const http = require('http');
const express = require('express');
const socketiO = require('socket.io');
var moment = require('moment');
var date = moment();
const JQuery = require( path.join(__dirname, '../public/js/libs/jquery-3.2.1.min.js'));
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketiO(server);

app.use(express.static(publicPath));

io.on('connection',function (socket){
  console.log('new user connected at '+ date.format('dd, h:mm a'));
  socket.on('disconnect',function (socket){
    console.log('disconnected from server at ' + date.format('dd, h:mm a'));
  });

  socket.emit('newMessage', generateMessage('Admin', 'welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user has joined at '+ date.format('dd, h:mm a')));

  socket.on('createMessage', function(message, callback){
    console.log(`Message sent at ` + date.format('dd, h:mm a'));
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', function(coords){
    console.log(`location sent at ` + date.format('dd, h:mm a'));
    io.emit('newLocationMessage', generateLocationMessage(coords.latitude, coords.longitude));
  });
});

app.get('/', function (req, res, next){
  res.render('index.html')
});

server.listen(port, function(){
  console.log(`server is up on ${port}`);
});
