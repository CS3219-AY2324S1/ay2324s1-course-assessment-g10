import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { lock, socketDetails } from './shared';
import { handleConnection } from './sockethandlers';

const PORT = process.env.PORT || 8082;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket: Socket) => {
  console.log("New connection from", socket.id);
  const release = await lock.acquire();
  try {
    socketDetails[socket.id] = {
      inQueue: false,
      isMatched: false,
      socket,
    };
  } finally {
    release();
  }

  handleConnection(socket);
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});