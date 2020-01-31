'use strict';

const io = require('socket.io')(3001);
const uuid = require('uuid').v4;

const undelivered = {
  // acme: {},
  // flowers: {},
};

io.on('connection', socket => {
  console.log('CONNECTED', socket.id);
});

io.of('/deliveries', socket => {

  // handle recieved event
  socket.on('recieved', payload => {

  });

  // handle getall undelivered messages
  socket.on('getall', messages => {
    try{

    }
    catch(error){console.error(error);}
  }); 

  // handle subscribe event
  socket.on('subscribe', payload => {
    //deconstruct payload
    let {event, clientID} = payload;
    console.log(clientID);
    if(!undelivered[clientID]){undelivered[clientID] = [];}
    // if(!undelivered[event][clientID]){undelivered[event][clientID] = {};}
    // join room of client id
    socket.join(clientID);
  });

  // handle recieving message of package delivery
  socket.on('package-delivered', message => eventHandler('package-delivered', message));
  // on route event recieved
  // create unique ID
  // emit event
  function eventHandler(event, message){
    let messageID = uuid();
    console.log('packagehandle', undelivered);
    console.log(undelivered);
    // check for subsscribers in undelievered and add into message payload
    for(let subscriber in undelivered){
      console.log(undelivered[subscriber]);
      console.log(message.retailer);
      if(subscriber === message.retailer) undelivered[subscriber].push({messageID: messageID, message: message});
      // undelivered[event][subscriber][messageID] = message.payload;
    }
    console.log('packagehandle', undelivered.acmewidgets);

    socket.broadcast.emit(event, {messageID: messageID, payload: message});
  }
});

