import { Interval } from "node-interval-tree";
import { Socket } from "socket.io";

export interface EngineMatch {
    sockdet: socketDetail;
    room: string;
    questionId: string;
}

export interface Match {
    user: string;
    room: string;
    questionId: string;
    init: boolean;
}

export interface MatchRequest {
    username: string;
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
    username?: string;
    UserDetail?: UserInterval;
    countdown?: NodeJS.Timeout;
}
