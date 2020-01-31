'use strict';

const DeliveryClient = require('../classes/delivery-clients');

const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001/deliveries');

const Client = new DeliveryClient('flowersrus', socket);

Client.connect();