"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const shared_1 = require("./shared");
const rabbitmq_1 = require("./rabbitmq");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    shared_1.sockidToSocket.set(socket.id, socket);
    socket.on('cancel', (data) => {
        console.log('Cancel event received');
        (0, rabbitmq_1.removeMatchFromQ)(data);
        shared_1.uidToUserWsockid.delete(data.id);
    });
    socket.on('findMatch', async (data) => {
        console.log(`Match event received from ${data.id}`);
        shared_1.uidToUserWsockid.set(data.id, {
            ...data,
            socketId: socket.id,
            isMatched: false,
        });
        await (0, rabbitmq_1.addMatchToQ)(data);
    });
    socket.on('disconnect', () => {
        console.log(`User with socket ID ${socket.id} disconnected`);
        shared_1.sockidToSocket.delete(socket.id);
    });
});
const port = process.env.PORT || 8082;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
