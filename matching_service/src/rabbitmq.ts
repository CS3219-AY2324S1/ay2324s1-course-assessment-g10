import * as amqp from 'amqplib';
import { Match, User } from './types';
import {  uidToUserWsockid, sockidToSocket } from './shared';

let connection: amqp.Connection;
const diffs = ['diff1', 'diff2', 'diff3', 'diff4'];
let consumeCh: amqp.Channel;
const diffchs:amqp.Channel[] = [];

(async () => {
    connection = await amqp.connect('amqp://localhost');
    consumeCh = await connection.createChannel();
    await consumeCh.assertQueue('match', { durable: false });
    for (let i = 0; i < diffs.length; i++) {
        diffchs.push(await connection.createChannel());
        await diffchs[i].assertQueue(diffs[i], { durable: false });
    }

    await consumeCh.consume('match', async (msg) => {
        if (!msg) return;
        const match = JSON.parse(msg.content.toString()) as Match;
        await getMatch(match);
        consumeCh.ack(msg);
    });
})();


const diffToScheme = (diff: number) => {
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

const addMatchToQ = async (user: User) => {
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
}

const removeMatchFromQ = async (user: User) => {
    const { id, difficultyFrom, difficultyTo } = user;
    const diffFrom = diffToScheme(difficultyFrom);
    const diffTo = diffToScheme(difficultyTo);
    for (let i = diffFrom; i <= diffTo; i++) {
        await diffchs[i].sendToQueue(diffs[i], Buffer.from(JSON.stringify({
            user: id,
            add: false,
        })));
    }
}

const getMatch = async (match: Match) => {
    const { user1, user2, questionId, hostUser } = match;
    const u1 = uidToUserWsockid.get(user1);
    const u2 = uidToUserWsockid.get(user2);
    if (u1 && u2 && !u1.isMatched && !u2.isMatched) {
        const sock1 = sockidToSocket.get(u1.socketId);
        const sock2 = sockidToSocket.get(u2.socketId);
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
        const sock = sockidToSocket.get(u1.socketId);
        if (sock) {
            await addMatchToQ(u1);
        } else {
            await removeMatchFromQ(u1);
        }
    }

    if (u2) {
        if (u2.isMatched) {
            removeMatchFromQ(u2);
            return;
        }
        const sock = sockidToSocket.get(u2.socketId);
        if (sock) {
            await addMatchToQ(u2);
        } else {
            await removeMatchFromQ(u2);
        }
    }
}



export { addMatchToQ, removeMatchFromQ };
