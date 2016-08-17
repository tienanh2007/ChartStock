'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'public/chart.html');

const server = express()
.use(express.static(path.join(__dirname, 'public')))
.use((req, res) => res.sendFile(INDEX) )
.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });
let messages = [];
wss.on('connection', (ws) => {
  console.log('Client connected');
  if(messages.length != 0){
    ws.send(JSON.stringify(messages));
  }
  ws.on('message', function (message) {
    let data = JSON.parse(message).data;
    let action = JSON.parse(message).action;
    if(action == "add"){
      messages.push(data)
    }
    else {
      messages.splice(messages.indexOf(data),1)
      console.log(messages)
    }
    console.log('Message Received: %s', message);
    wss.clients.forEach(function (conn) {
      conn.send(message);
    });
  });
  ws.on('close', () => console.log('Client disconnected'));
});
