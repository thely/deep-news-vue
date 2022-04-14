import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import StockMarket from "./srv/StockMarketSimulator.js";

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

// market.stockBaseData();

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
    // socket.emit('stockBaseData', market.stocks);
  } catch (e) {
    console.log(e);
  }
  
  // tell everyone else you exist
  socket.broadcast.emit('addUser', { id: socket.id, isSelf: false });
  market.marketActive = true;
  market.stockDayLoop((data) => {
    io.emit("stockUpdateData", data);
  });

  // Change username
  socket.on('nameChange', (data) => {
    console.log("trying a name change");
    console.log(data);
    socket.data.username = data.name;
    console.log(socket.data.username);
    io.emit('nameChange', { id: socket.id, name: data.name });
  });


  // new message entered
  socket.on('message', (data) => {
    console.log('message: ', JSON.stringify(data));

    io.emit('message', { 
      user: socket.id,
      msgID: msgID, 
      text: data.msg, 
      time: new Date().toISOString() 
    });

    msgID++;

    const stock = market.analyseForStocks(data.msg);
    if (stock) {
      market.addStock(stock);
      io.emit('addStock', stock);
    }
  });

  socket.on('updateMessage', (data) => {
    socket.broadcast.emit('updateMessage', data);
  });

  socket.on('buyStock', (data) => {
    market.changeUserShares(data, 1);
  });

  socket.on('sellStock', (data) => {
    market.changeUserShares(data, -1);
  });

  socket.on('updateMarket', ({ data, state, message }) => {
    console.log(data);
    market.emojiTotals(data, state, message);
  });

  socket.on('disconnect', async () => {
    console.log(`Client disconnected [id=${socket.id}]`);
    io.emit('deleteUser', { id: socket.id });

    try {
      sockets = await io.fetchSockets();
      console.log(sockets.length);
      if (sockets.length <= 0) {
        market.marketActive = false;
      }
    } catch (e) {
      console.log(e);
    }
  });
});


// actual server location
http.listen(8081, () => {
  console.log('listening on *:8081');
});