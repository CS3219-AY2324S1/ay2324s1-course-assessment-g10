import { Interval } from "node-interval-tree";
import { Socket } from "socket.io";

export interface Match {
    user1: string;
    user2: string;
    room: string;
    questionId: string;
}

export interface MatchRequest {
    uid: string;
    preferredQn?: string;
    from: number;
    to: number;
}

export interface UserInterval extends Interval {
    socketid: string;
    preferredQn?: string;
}

export interface socketDetail {
    socket: Socket;
    inQueue: boolean;
    isMatched: boolean;
    uid?: string;
    UserDetail?: UserInterval;
    countdown?: NodeJS.Timeout;
}
