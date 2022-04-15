import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import StockMarket from "./srv/StockMarketSimulator.js";

const fs = require('fs');
const path = require('path');


// const ngrok = require('ngrok');
const localtunnel = require('localtunnel');
// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
// const { exec: execAsync } = require('child-process-async');
// const open = require('open');

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
  market.stockDayLoop((stocks, state, emojis) => {
    io.emit("stockUpdateData", { stocks: stocks, state: state, emojis: emojis });
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

// const fs = require('fs');
// const data = {table:[{id: 1, name: 'my name'}]}
const file_path = './.env';

async function writeFile(filename, writedata) {
  try {
    await fs.promises.writeFile(filename, writedata, 'utf8');
    console.log('data is written successfully in the file')
  }
  catch (err) {
    console.log('not able to write data in the file ')
  }
}


// actual server location
http.listen(8081, () => {
  console.log('listening on *:8081');

  // 
  // (async () => {
  //   await ngrok.authtoken("27qfyITYRTTuJLV6ydrtwtCPEw7_3EZUFKCjNd9Z1N5rxdhKt");
  //   const url = await ngrok.connect({
  //     addr: 8081,
  //     // hostHeader: "rewrite",
  //   });
  //   await writeFile(file_path, `VUE_APP_SERVER=${url}`);
  //   console.log(url);
  // })();
  
  (async () => {
    let tunnel;
    try {
      tunnel = await localtunnel({ port: 8081 });
      await writeFile(file_path, `VUE_APP_SERVER=${tunnel.url}`);
      await writeFile("run-test/OPENME.txt", tunnel.url);
      // const result = await exec(`curl -H "Disable-Tunnel-Reminder: true" --insecure ${url}`);
      // console.log(result);
      
    } catch (e) {
      console.log(e);
    }

    // const url = tunnel.url.replace("https", "http");
    // open(url).then(proc => {
    //   proc.on('error', (e) => { console.log(e); });
    // })
    // .catch((e) => console.log(e));

    // console.log("opening tunnel");
    console.log(tunnel.url);

    tunnel.on('close', () => {
      console.log("closing tunnel");
    });
  })();
});