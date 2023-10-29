import { Socket } from "socket.io";
import { UserWithSocketId } from "./types";

export const uidToUserWsockid = new Map<string, UserWithSocketId>();
export const sockidToSocket = new Map<string, Socket>();

export const getSockFromUid = (uid: string) => {
    const userWsockid = uidToUserWsockid.get(uid);
    if (userWsockid)
        return sockidToSocket.get(userWsockid.socketId);
    return undefined;
}