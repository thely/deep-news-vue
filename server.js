import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import StockMarket from "./srv/StockMarket.js";

const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').Server(app);
app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});


app.get('/videos', (req, res) => {
  console.log("attempting to read video files");
  const __dirname = path.resolve();
  fs.readdir(path.resolve(__dirname, "public/assets"), (err, files) => {
    if (err) {
      console.log(err);
    }
    else {  
      files = files.filter((vid) => {
        if (vid.includes(".mp4") || vid.includes(".m4v") || vid.includes(".mov")) {
          return true;
        }
      });

      res.json({ videos: files });
    }
  });
});


let msgID = 0;
let market = new StockMarket();

io.on('connection', async (socket) => {
  console.log(`Client connected [id=${socket.id}]`);
  let sockets;

  try {
    // get all existing sockets
    sockets = await io.fetchSockets();
    sockets = sockets.map((s) => {
      return { id: s.id, data: s.data };
    });

    // tell yourself you exist
    socket.emit('addUser', { id: socket.id, isSelf: true, others: sockets });
    socket.emit('stockBaseData', market.stockBaseData());
  } catch (e) {
    console.log(e);
  }
  
  // tell everyone else you exist
  socket.broadcast.emit('addUser', { id: socket.id, isSelf: false });

  // Change username
  socket.on('nameChange', (data) => {
    console.log("trying a name change");
    console.log(data);
    socket.data.username = data.name;
    console.log(socket.data.username);
    io.emit('nameChange', { id: socket.id, name: data.name });
  });


  // Type message + send it
  socket.on('message', (data) => {
    console.log('message: ', JSON.stringify(data));
    io.emit('message', { 
      user: socket.id,
      msgID: msgID, 
      text: data.msg, 
      time: new Date().toISOString() 
    });

    msgID++;
  });

  socket.on('updateMessage', (data) => {
    socket.broadcast.emit('updateMessage', data);
  });

  socket.on('updateMarket', ({ data, state }) => {
    market.emojiTotals(data, state);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected [id=${socket.id}]`);
    io.emit('deleteUser', { id: socket.id });
  });
});


// actual server location
http.listen(8081, () => {
  console.log('listening on *:8081');
});