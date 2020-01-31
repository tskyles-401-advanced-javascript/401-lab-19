'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3001/deliveries');

// subscribe to package-delivered event
socket.emit('subscribe', {event: 'package-delivered', clientID: 'acmewidgets'});

// emit getall event
// socket.emit('getall', {event: 'package-delivered', clientID: 'acme-widgets'});

// crud handling
socket.on('package-delivered', message => handleDelivered(message));

// on package-delivered event
// log custom message
// respond with read reciept so queue can dequeue
function handleDelivered(message){
  console.log('DELIVERED', message.payload);
  let readReciept = {
    clientID: 'acmeWidget',
    messageID: message.messageID,
    event: 'package-delivered',
  };
  socket.emit('recieved', readReciept);
}


