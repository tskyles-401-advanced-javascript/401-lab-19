'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3001');

// subscribe to package-delivered event
socket.emit('subscribe', {event: 'package-delivered', clientID: 'acme-widgets'});

// emit getall event
socket.emit('getall', {event: 'package-delivered', clientID: 'acme-widgets'});

// crud handling
socket.on('package-delivered', handleDelivered);

// on package-delivered event
// log custom message
// respond with read reciept so queue can dequeue
function handleDelivered(data){
  console.log('DELIVERED', data.payload);
  let readReciept = {
    clientID: 'acme-widget',
    messageID: data.messageID,
    event: 'package-delivered',
  };
  socket.emit('recieved', readReciept);
}


