import $ from 'jquery';
import { socket } from './App'; // connect to the server

const sendmsg = (e) =>{

    e.preventDefault();

    let msg = $('input[name="msgContent"]').val(),
        from = $('input[name="from"]').val();

    socket.emit('createMessage', {
        from    : `${from}`,
        content : `${msg}`
    });

    $('input[name="from"]').prop("disabled", true);
    $('input[name="msgContent"]').val("");
};

export { sendmsg };