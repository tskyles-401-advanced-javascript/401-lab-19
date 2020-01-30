'use strict';

const io = require('socket.io');
const uuid = require('uuid').v4;

const undelivered = {};

io.on('connection', socket => {
  console.log('CONNECTED', socket.id);

  io.of('/deliveries', socket => {
    // handle recieved event
    socket.on('recieved', payload => {
      let {clientID, messageID, event} = payload;
      delete undelivered[clientID][messageID][event];
    });
    // handle subscribe event
    socket.on('subscribe', payload => {
      let {event, clientID} = payload;

      if(!undelivered[event]){undelivered[event] = {};}
      if(!undelivered[event][clientID]){undelivered[event][clientID] = {};}

      socket.join(clientID);
    });

    // handle recieving message of package delivery
    socket.on('package-delivered', message => eventHandler('package-delivered', message));

    // on route event recieved
    // create unique ID
    // emit event
    function eventHandler(event, message){
      let messageID = uuid();
      // check for subsscribers in undelievered and add into message payload

      socket.emit(event, {messageID: messageID, payload: message});
    }
  });
});
