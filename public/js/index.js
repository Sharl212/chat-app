var socket = io();

socket.on('connect',function(){
  console.log('connected to server.');
});

socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('hh:mm a'),
      li = $('<li></li>');
  console.log('new Message', message);
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();
  var user = $('[name=user]').val(),
      text = $('[name=message]').val();

  if (text || user === 'text'){
      socket.emit('createMessage', {
        from: `${user}`,
        text: `${text}`
    }, function () {
      $('[name=message]').val('');
    });
  }else if (text || user === '') {
    console.log('ENTER UR MESSAGE');
  };
});

socket.on('newLocationMessage', function(message){
  var li = $('<li></li>'),
      a = $('<a target="_blank">my location</a>'),
      formattedTime = moment(message.createdAt).format('hh:mm a');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});

var locationButton = $('#locationbutton');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('your browser does not support geolocation.');
  }

  locationButton.attr('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled');
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    locationButton.attr('disable','disabled');
  });
});

socket.on('disconnect', function (){
  console.log('disconnected from server (user).');
});
