import * as amqp from 'amqplib';
import { Match, User } from './type';
import { removeUser, removeRandomUser, addUser } from './db'

const channel = process.argv[2];
const retChannel = "match"

let connection: amqp.Connection;
let writeCh: amqp.Channel;

const tryMatchUser = async (uid: string) => {
    const possiblematch = await removeRandomUser();
    if (!possiblematch) {
        await addUser(uid);
        return;
    }
    if (possiblematch == uid) return;

    await writeCh.sendToQueue(retChannel, Buffer.from(JSON.stringify({
        user1: uid,
        user2: possiblematch,
        questionId: "1",
        hostUser: uid,
    })));
}

(async () => {
    connection = await amqp.connect('amqp://localhost');
    const consumeCh = await connection.createChannel();
    writeCh = await connection.createChannel();
    await writeCh.assertQueue(retChannel, { durable: false });
    await consumeCh.assertQueue(channel, { durable: false });

    consumeCh.consume(channel, async (msg) => {
        if (!msg) return; 
        const data = JSON.parse(msg.content.toString()) as User;
        console.log("received", data)
        if (data.add) {
            await tryMatchUser(data.user);
        } else {
            await removeUser(data.user);
        }
        consumeCh.ack(msg);
    })
})();
