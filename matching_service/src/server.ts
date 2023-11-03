import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { lock, socketDetails } from './shared';
import { handleConnection } from './sockethandlers';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket: Socket) => {
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
