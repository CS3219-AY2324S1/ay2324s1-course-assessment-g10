"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSockFromUid = exports.sockidToSocket = exports.uidToUserWsockid = void 0;
exports.uidToUserWsockid = new Map();
exports.sockidToSocket = new Map();
const getSockFromUid = (uid) => {
    const userWsockid = exports.uidToUserWsockid.get(uid);
    if (userWsockid)
        return exports.sockidToSocket.get(userWsockid.socketId);
    return undefined;
};
exports.getSockFromUid = getSockFromUid;
