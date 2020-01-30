'use strict';

const io = require('socket.io');
const uuid = require('uuid').v4;

const undelivered = {};

io.on('connect', socket => {
  console.log('CONNECTED', socket.id);

  socket.on('package-delivery', payload => eventHandler('package-delivery', payload));

  function eventHandler(event, payload){
    let messageID = uuid();

    socket.emit(event, {messageID: messageID, payload: payload});
  }
});