import { Socket } from "socket.io";
import { MatchRequest, UserInterval, socketDetail } from "./types";
import { addInterval, findMatch, removeInterval } from "./engine";
import { lock, socketDetails } from "./shared";

const remove = async (socket: Socket) => {
    const release = await lock.acquire();
    const detail = socketDetails[socket.id];
    try {
        delete socketDetails[socket.id];
        if (detail?.UserDetail) removeInterval(detail.UserDetail);
        socket.disconnect();
    } finally {
        release();
    }
}

const handleMatchRequest = async (socket: Socket, req: MatchRequest) => {
    console.log(`Match request received from ${req.uid}`);
    const {from, to, uid, preferredQn} = req;
    let detail: socketDetail | undefined = undefined;
    let release = await lock.acquire();
    try {
        detail = socketDetails[socket.id];
    } finally {
        release();
    }
    if (!detail) return;

    const userDetail: UserInterval = {
        low: from,
        high: to,
        preferredQn: preferredQn,
        socketid: socket.id,
    }

    detail.UserDetail = userDetail;
    detail.inQueue = true;
    detail.isMatched = false;
    detail.uid = uid;

    const match = await findMatch(userDetail);
    if (!match) {
        release = await lock.acquire();
        try {
            addInterval(userDetail);
            detail.inQueue = true;
            let countdown = 30;
            detail.countdown = setInterval(() => {
                if (countdown === 0) {
                    lock.runExclusive(async () => {await remove(socket)});
                    return;
                }
                socket.emit('countdown', countdown--);
            }, 1000);

            socket.emit('isCancellable');
        } finally {
            release();
        }
    }
    socket.emit('matchFound', match);
}

export const handleConnection = (socket: Socket) => {
    socket.on('findMatch', req => handleMatchRequest(socket, req));
    socket.on('cancel', () => remove(socket));
    socket.on('disconnect', () => remove(socket));
}
