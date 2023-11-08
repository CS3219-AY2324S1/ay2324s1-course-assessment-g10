import * as amqp from 'amqplib';
import { Match, User } from './types';
import {  uidToUserWsockid, sockidToSocket } from './shared';

let connection: amqp.Connection;
const diffs = ['diff1', 'diff2', 'diff3', 'diff4'];
let consumeCh: amqp.Channel;
const diffchs:amqp.Channel[] = [];

(async () => {
    connection = await amqp.connect('amqp://rabbitmq');
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
    const s1 = u1 ? sockidToSocket.get(u1.socketId) : undefined;
    const s2 = u2 ? sockidToSocket.get(u2.socketId) : undefined;
    if (u1 && u2 && !u1.isMatched && !u2.isMatched) {
        if (s1 && s2) {
            u1.isMatched = true;
            u2.isMatched = true;
            u1.matchedWith = u2.id;
            u2.matchedWith = u1.id;
            const room = Buffer.from(`${u1.id}/${u2.id}/${questionId}`).toString('base64');
            s1.emit('matchFound', {
                partner: u2.id,
                qn: questionId,
                init: true, // decentralized initialization of data
                room: room
            });
            s2.emit('matchFound', {
                partner: u1.id,
                qn: questionId,
                init: false,
                room: room
            });
            await removeMatchFromQ(u1);
            await removeMatchFromQ(u2);
        }
    }

    console.log('One of the users has disconnected/cancelled/matched');
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
