var socket = io();

socket.on('connect',function(){
  console.log('connected to server.');
});
  // send text message structure //
socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('hh:mm a'),
      template = $('#message-template').html(),
      html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
      });

    $('#messages').append(html);
});
  // button for sending message //
$('#message-form').on('submit', function (e) {
  e.preventDefault();
  var user = $('[name=user]').val(),
      text = $('[name=message]').val();

  if (text || user === 'text'){
    $('.username').prop("disabled", true);
    socket.emit('createMessage', {
      from: `${user}`,
      text: `${text}`
    }, function () {
      $('[name=message]').val('');
    });
  }else if (text || user === '') {
    console.log('ENTER UR MESSAGE');
  }else if(user !== 'text'){
    console.log('ENTER YOUR USERNAME');
  };
});
  // send location message structure //
socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('hh:mm a'),
      template = $('#location-template').html(),
      html = Mustache.render(template, {
        from: $('[name=user]').val(),
        url: message.url,
        createdAt: formattedTime
      });

  $('#messages').append(html);
});

// button for sending location //
var locationButton = $('#locationbutton'),
    user = $('[name=user]').val(),
    text = $('[name=message]').val();
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('your browser does not support geolocation.');
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    if(user == ''){
      console.log('ENTER YOUR USERNAME');
    }else{
      $('.username').prop("disabled", true);
      locationButton.attr('disabled', 'disabled').text('Sending location..');
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }
  }, function(){
    locationButton.attr('disable','disabled').text('Check your internet');
  });
});

socket.on('disconnect', function (){
  console.log(`${user} disconnected from server.`);
});
