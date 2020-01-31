'use strict';

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001/deliveries');

class DeliveryClient {
  constructor(clientID, socket){
    this.clientID = clientID.toLowerCase();
    this.socket = socket;
  }

  connect(){
    // subscribe to client specific room
    socket.emit('subscribe', {clientID: this.clientID});
    // get all stored messages for client
    socket.emit('getall', {event: 'package-delivered', clientID: this.clientID});
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
  }
}

module.exports = DeliveryClient;


