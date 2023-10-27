import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { uidToUserWsockid, sockidToSocket } from './shared';
import { User } from './types';
import { addMatchToQ, removeMatchFromQ } from './rabbitmq';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket: Socket) => {
  sockidToSocket.set(socket.id, socket);
  
  socket.on('cancel', (data: User) => {
    console.log('Cancel event received');
    removeMatchFromQ(data);
    uidToUserWsockid.delete(data.id);
  });
  
  socket.on('findMatch', async (data: User) => {
    console.log(`Match event received from ${data.id}`);
    uidToUserWsockid.set(data.id, {
      ... data,
      socketId: socket.id,
      isMatched: false,
    });
    await addMatchToQ(data);
  });

  socket.on('disconnect', () => {
    console.log(`User with socket ID ${socket.id} disconnected`);
    sockidToSocket.delete(socket.id);
  });
});

const port = process.env.PORT || 8082;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
