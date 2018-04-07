import socketIOClient from 'socket.io-client';

import { generateMessage } from './generateMessage.js';

const socket = socketIOClient("http://localhost:4000/");
    
socket.on('connection', ()=>{
  console.log('connected to the server');
})


socket.on('connection', (socket)=>{
  socket.on('disconnect', ()=> {
      console.log("disconnected from server!");
  });

  socket.emit('newMessage', generateMessage("Admin", "Welcome to our Chat room"));

  socket.on('createMessage', (message)=>{
    socket.emit('newMessage', generateMessage(message.from, message.content));
  });

});