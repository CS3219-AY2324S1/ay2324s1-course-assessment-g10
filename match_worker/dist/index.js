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
const amqp = __importStar(require("amqplib"));
const db_1 = require("./db");
const channel = process.argv[2];
const retChannel = "match";
let connection;
let writeCh;
const tryMatchUser = async (uid) => {
    const possiblematch = await (0, db_1.removeRandomUser)();
    if (!possiblematch) {
        await (0, db_1.addUser)(uid);
        return;
    }
    if (possiblematch == uid)
        return;
    await writeCh.sendToQueue(retChannel, Buffer.from(JSON.stringify({
        user1: uid,
        user2: possiblematch,
        questionId: "1",
        hostUser: uid,
    })));
};
(async () => {
    connection = await amqp.connect('amqp://localhost');
    const consumeCh = await connection.createChannel();
    writeCh = await connection.createChannel();
    await writeCh.assertQueue(retChannel, { durable: false });
    await consumeCh.assertQueue(channel, { durable: false });
    consumeCh.consume(channel, async (msg) => {
        if (!msg)
            return;
        const data = JSON.parse(msg.content.toString());
        console.log("received", data);
        if (data.add) {
            await tryMatchUser(data.user);
        }
        else {
            await (0, db_1.removeUser)(data.user);
        }
        consumeCh.ack(msg);
    });
})();
