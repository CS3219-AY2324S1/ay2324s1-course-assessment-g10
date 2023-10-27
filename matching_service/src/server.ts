import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { uidToUserWsockid, sockidToSocket, getSockFromUid } from './shared';
import { User } from './types';
import { addMatchToQ, removeMatchFromQ } from './rabbitmq';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  sockidToSocket.set(socket.id, socket);
  
  socket.on('cancel', (data: User) => {
    console.log('Cancel event received');
    removeMatchFromQ(data);
    uidToUserWsockid.delete(data.id);
    socket.disconnect();
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

  socket.on('leave', async (data: User) => {
    console.log(`Leave event received from ${data.id}`);
    const user = uidToUserWsockid.get(data.id);
    if (!user) return;
    if (user.matchedWith) {
      const sock = getSockFromUid(user.matchedWith);
      sock?.emit('matchLeave');
    }
    await removeMatchFromQ(data);
    uidToUserWsockid.delete(data.id);
    socket.disconnect();
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
