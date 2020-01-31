'use strict';

const io = require('socket.io')(3001);
const uuid = require('uuid').v4;

const undelivered = {
};

io.on('connection', socket => {
  console.log('CONNECTED', socket.id);
});

io.of('/deliveries', socket => {

  // handle recieved event
  socket.on('recieved', readReciept => {
    console.log('recieved', undelivered);
    if(undelivered[readReciept.clientID][0].messageID === readReciept.messageID){
      undelivered[readReciept.clientID].shift();
      console.log('recieved', undelivered);

    }
  });

  // handle getall undelivered messages
  socket.on('getall', message => {
    // try{
    for(let subscriber in undelivered){
      if(subscriber === message.clientID){
        for(let i = 0; i < undelivered[subscriber].length; i++){
          console.log('sent to... ', undelivered[subscriber][i].message.retailer, {messageID: undelivered[subscriber][i].messageID, payload: undelivered[subscriber][i].message});
          socket.of('deliveries').to('acmewidgets').emit(undelivered[subscriber][i].event, {messageID: undelivered[subscriber][i].messageID, payload: undelivered[subscriber][i].message});
        }
      }
    }
  //   }
  //   catch(e){console.error(e);}
  });

  // handle subscribe event
  socket.on('subscribe', payload => {
    //deconstruct payload
    let {clientID} = payload;
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
    // check for subsscribers in undelievered and add into message payload
    for(let subscriber in undelivered){
      if(subscriber === message.retailer) undelivered[subscriber].push({messageID: messageID, message: message, event: event});
    }
    console.log(undelivered);
    socket.to(message.retailer).emit(event, {messageID: messageID, payload: message});
  }
});