'use strict';

const io = require('socket.io-client');

const socket = io.connect('http://localhost:3001/deliveries');

// subscribe to client specific room
socket.emit('subscribe', {clientID: 'acmewidgets'});

// get all stored messages for client
socket.emit('getall', {event: 'package-delivered', clientID: 'acmewidgets'});

// crud handling
socket.on('package-delivered', message => handleDelivered(message));

// recieve message from queue server and send read reciept back to queue server
function handleDelivered(message){
  console.log('DELIVERED', message.payload);
  let readReciept = {
    clientID: message.payload.retailer,
    messageID: message.messageID,
    event: 'package-delivered',
  };
  socket.emit('recieved', readReciept);
}


