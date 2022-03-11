const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

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
    io.emit('message', { user: socket.id, text: data.msg, time: new Date().toISOString() });
  });


  socket.on('disconnect', () => {
    console.log(`Client disconnected [id=${socket.id}]`);
    io.emit('deleteUser', { id: socket.id });
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});