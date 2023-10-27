"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMatchFromQ = exports.addMatchToQ = void 0;
const amqp = __importStar(require("amqplib"));
const shared_1 = require("./shared");
let connection;
const diffs = ['diff1', 'diff2', 'diff3', 'diff4'];
let consumeCh;
const diffchs = [];
(async () => {
    connection = await amqp.connect('amqp://localhost');
    consumeCh = await connection.createChannel();
    await consumeCh.assertQueue('match', { durable: false });
    for (let i = 0; i < diffs.length; i++) {
        diffchs.push(await connection.createChannel());
        await diffchs[i].assertQueue(diffs[i], { durable: false });
    }
    await consumeCh.consume('match', async (msg) => {
        if (!msg)
            return;
        const match = JSON.parse(msg.content.toString());
        await getMatch(match);
        consumeCh.ack(msg);
    });
})();
const diffToScheme = (diff) => {
    if (diff < 3) {
        return 0;
    }
    if (diff < 6) {
        return 1;
    }
    if (diff < 8) {
        return 2;
    }
    return 3;
};
const addMatchToQ = async (user) => {
    const { id, difficultyFrom, difficultyTo } = user;
    const diffFrom = diffToScheme(difficultyFrom);
    const diffTo = diffToScheme(difficultyTo);
    for (let i = diffFrom; i <= diffTo; i++) {
        console.log(`Adding to queue ${i}`);
        await diffchs[i].sendToQueue(diffs[i], Buffer.from(JSON.stringify({
            user: id,
            add: true,
        })));
    }
};
exports.addMatchToQ = addMatchToQ;
const removeMatchFromQ = async (user) => {
    const { id, difficultyFrom, difficultyTo } = user;
    const diffFrom = diffToScheme(difficultyFrom);
    const diffTo = diffToScheme(difficultyTo);
    for (let i = diffFrom; i <= diffTo; i++) {
        await diffchs[i].sendToQueue(diffs[i], Buffer.from(JSON.stringify({
            user: id,
            add: false,
        })));
    }
};
exports.removeMatchFromQ = removeMatchFromQ;
const getMatch = async (match) => {
    const { user1, user2, questionId, hostUser } = match;
    const u1 = shared_1.uidToUserWsockid.get(user1);
    const u2 = shared_1.uidToUserWsockid.get(user2);
    if (u1 && u2 && !u1.isMatched && !u2.isMatched) {
        const sock1 = shared_1.sockidToSocket.get(u1.socketId);
        const sock2 = shared_1.sockidToSocket.get(u2.socketId);
        if (sock1 && sock2) {
            sock1.emit('matchFound', {
                questionId,
                hostUser,
            });
            sock2.emit('matchFound', {
                questionId,
                hostUser,
            });
            await removeMatchFromQ(u1);
            await removeMatchFromQ(u2);
        }
    }
    console.log('One of the users has disconnected/cancelled');
    if (u1) {
        if (u1.isMatched) {
            removeMatchFromQ(u1);
        }
        const sock = shared_1.sockidToSocket.get(u1.socketId);
        if (sock) {
            await addMatchToQ(u1);
        }
        else {
            await removeMatchFromQ(u1);
        }
    }
    if (u2) {
        if (u2.isMatched) {
            removeMatchFromQ(u2);
            return;
        }
        const sock = shared_1.sockidToSocket.get(u2.socketId);
        if (sock) {
            await addMatchToQ(u2);
        }
        else {
            await removeMatchFromQ(u2);
        }
    }
};
