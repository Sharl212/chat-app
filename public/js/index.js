var socket = io();

socket.on('connect',function(){
  console.log('connected to server.');
});

socket.on('newMessage', function(message){
  console.log('new Message', message);
  var li = $('<li></li>');
  li.text(`${message.from}:${message.text}`);
  $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();
  var user = $('[name=user]').val(),
      text = $('[name=message]').val();

socket.emit('createMessage', {
      from: `${user}`,
      text: `${text}`
  }, function () {

  });
});

socket.on('newLocationMessage', function(message){
  var li = $('<li></li>'),
      a = $('<a target="_blank">my location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});

var locationButton = $('#locationbutton');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('not supported.');
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
      console.log('unable to fetch location.');
  });
});

socket.on('disconnect', function (){
  console.log('disconnected from server (user).');
});
