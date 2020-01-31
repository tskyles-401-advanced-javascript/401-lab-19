'use strict';

const io = require('socket.io')(3001);
const uuid = require('uuid').v4;
const Queue = require('../classes/queue');

const undelivered = {};

io.on('connection', socket => {
  console.log('CONNECTED:', socket.id);
});

const deliveries = io.of('/deliveries');

deliveries.on('connection', socket => {
  console.log('CONNECTED: deliveries');

  socket.on('recieved', readReciept => recievedHandler(readReciept));
  socket.on('getall', message => {handleGetAll(message);});
  socket.on('subscribe', payload => subscribeHandler(payload));
  socket.on('package-delivered', message => eventHandler('package-delivered', message));

  // check if top message ID matches readreciept messageID and delete
  function recievedHandler(readReciept){
    if(undelivered[readReciept.clientID].peek().messageID === readReciept.messageID){
      undelivered[readReciept.clientID].dequeue();
    }
    else{
      console.error('ERROR.... messageID does not match');
    }
  }

  // join client specific room when client emits subscribe event
  function subscribeHandler(payload){
    let {clientID} = payload;
    if(!undelivered[clientID]){undelivered[clientID] = new Queue();}
    socket.join(clientID);
    console.log('JOINED ROOM: ', clientID);
  }

  // recieve delivery message, add unique messageID and emit to correct client
  function eventHandler(event, message){
    let messageID = uuid();

    for(let subscriber in undelivered){
      if(subscriber !== message.retailer) console.error('could not find your client...');
      if(subscriber === message.retailer) undelivered[subscriber].enqueue({messageID: messageID, message: message, event: event});
    }
    socket.to(message.retailer).emit(event, {messageID: messageID, payload: message});
  }

  // get and send all stored messages for repective client
  function handleGetAll(message){
    for(let subscriber in undelivered){
      if(subscriber === message.clientID){
        if(undelivered[subscriber].peek() === null){
          return;
        }
        else{
          socket.emit(message.clientID, {messageID: undelivered[subscriber].peek().messageID, payload: undelivered[subscriber].peek().message});
        }
      }
    }
  }
});