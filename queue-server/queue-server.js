'use strict';

const io = require('socket.io')(3001);
const uuid = require('uuid').v4;

const undelivered = {
};

io.on('connection', socket => {
  console.log('CONNECTED', socket.id);
});

const deliveries = io.of('/deliveries');

deliveries.on('connection', socket => {
  console.log('CONNECTED: deliveries');

  // handle recieved event
  socket.on('recieved', readReciept => {
    if(undelivered[readReciept.clientID][0].messageID === readReciept.messageID){
      undelivered[readReciept.clientID].shift();
    }
  });

  // handle getall undelivered messages
  socket.on('getall', message => {handleGetAll(message);});

  // join client specific room when client emits subscribe event
  socket.on('subscribe', payload => {
 
    let {clientID} = payload;
    if(!undelivered[clientID]){undelivered[clientID] = [];}

    socket.join(clientID);
    console.log('JOINED ROOM: ', clientID);
  });

  socket.on('package-delivery', message => eventHandler('package-delivered', message));

  // recieve delivery message, add unique messageID and emit to correct client
  function eventHandler(event, message){
    let messageID = uuid();

    for(let subscriber in undelivered){
      if(subscriber === message.retailer) undelivered[subscriber].push({messageID: messageID, message: message, event: event});
    }
    socket.to(message.retailer).emit(event, {messageID: messageID, payload: message});
  }

  // get and send all stored messages for repective client
  function handleGetAll(message){
    for(let subscriber in undelivered){
      if(subscriber === message.clientID){
        for(let i = 0; i < undelivered[subscriber].length; i++){
          console.log('sent to... ', undelivered[subscriber][i].message.retailer, {messageID: undelivered[subscriber][i].messageID, payload: undelivered[subscriber][i].message});
          socket.emit(undelivered[subscriber][i].event, {messageID: undelivered[subscriber][i].messageID, payload: undelivered[subscriber][i].message});
        }
      }
    }
  }
});