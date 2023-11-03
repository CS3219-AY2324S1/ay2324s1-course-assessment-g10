import { Socket } from "socket.io";
import { Match, MatchRequest, UserInterval, socketDetail } from "./types";
import { addInterval, findMatch, removeInterval } from "./engine";
import { lock, socketDetails } from "./shared";

const remove = async (socket: Socket) => {
    console.log("disconnect/cancelMatch received from", socket.id)
    const release = await lock.acquire();
    const detail = socketDetails[socket.id];
    try {
        delete socketDetails[socket.id];
        if (detail?.UserDetail) removeInterval(detail.UserDetail);
        if (detail?.countdown) clearInterval(detail.countdown);
        socket.disconnect();
    } finally {
        release();
    }
}

const handleMatchRequest = async (socket: Socket, req: MatchRequest) => {
    console.log(`Match request received from ${req.username}`);
    const {from, to, username: uid, preferredQn} = req;
    let detail: socketDetail | undefined = undefined;
    let release = await lock.acquire();

    try {
        detail = socketDetails[socket.id];
    } finally {
        release();
    }
    if (!detail) return; // user disconnected

    const userDetail: UserInterval = {
        low: from,
        high: to,
        preferredQn: preferredQn,
        socketid: socket.id,
    }

    detail.UserDetail = userDetail;
    detail.inQueue = true;
    detail.isMatched = false;
    detail.username = uid;

    const match = await findMatch(userDetail);
    if (!match) {
        release = await lock.acquire();

        try {
            addInterval(userDetail);
            detail.inQueue = true;
            let countdown = 29;
            detail.countdown = setInterval(async () => {
                if (countdown === 0) {
                    await remove(socket);
                    clearInterval(detail?.countdown);
                    return;
                }
                socket.emit('countdown', countdown--);
            }, 1000);
        } finally {
            release();
        }
        return;
    }
    socket.emit('matchFound', {
        questionId: match.questionId,
        room: match.room,
        user: match.sockdet.username,
        init: true
    } as Match);
    match.sockdet.socket.emit('matchFound', {
        questionId: match.questionId,
        room: match.room,
        user: detail.username,
        init: false
    } as Match);
}

export const handleConnection = (socket: Socket) => {
    socket.on('findMatch', req => handleMatchRequest(socket, req));
    socket.on('cancelMatch', () => remove(socket));
    socket.on('disconnect', () => remove(socket));
}
