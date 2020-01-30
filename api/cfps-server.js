'use strict';

const express = require('express');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/delivery/:retailer/:code', handleEvent);

function handleEvent(req, res){
  let payload = {
    retailer: 'TODO', 
    code: 'TODO',
  };
  socket.emit('package-delivered', {clientID: 'api', payload: payload});
  console.log(req);
  res.status(200).send(payload);
}

app.listen(PORT, () => console.log(`api server listening on ${PORT}`));