import { Interval, IntervalTree } from "node-interval-tree";
import { EngineMatch, UserInterval, socketDetail } from "./types";
import { fetchRandQn } from "./communication";
import { lock, socketDetails } from "./shared";

const tree = new IntervalTree<UserInterval>();

export const addInterval = (interval: UserInterval) => tree.insert(interval);
export const removeInterval = (interval: UserInterval) => tree.remove(interval);
export const findOverlaps = (low: number, high: number) => tree.search(low, high);
const overlapOf = (user1: UserInterval, user2: UserInterval): Interval => {
    return {
        low: Math.max(user1.low, user2.low),
        high: Math.min(user1.high, user2.high),
    };
}

export const findMatch = async (user: UserInterval): Promise<EngineMatch | null> => {
    const overlaps = findOverlaps(user.low, user.high);
    
    for (const overlap of overlaps) {
        if (user.preferredQn && user.preferredQn !== overlap.preferredQn) continue;
        let res = false;
        let matchedDetail: socketDetail | undefined = undefined;
    
        const release = await lock.acquire();
        try { // mutex area
            matchedDetail = socketDetails[overlap.socketid];
            const detail = socketDetails[user.socketid];
            if (!(matchedDetail?.inQueue)) continue; // found user left/disconnected
            if (!detail) return null; // users has cancelled/disconnected

            res = removeInterval(overlap);
            res = res && (matchedDetail.inQueue ?? false);
            if (res) {
                // a match is found
                detail.inQueue = false;
                detail.isMatched = true;
                detail.inQueue = false;
                detail.isMatched = true;
                clearInterval(detail.countdown);
                clearInterval(matchedDetail.countdown);
            }
        } finally {
            release();
        }
        if (!res) continue;

        // we have found a match
        const match = overlapOf(user, overlap);
        const qn = (user.preferredQn ?? overlap.preferredQn) ?? await fetchRandQn(match.low, match.high) ?? "";
        // we always assume we would find some qn        
        return {
            questionId: qn,
            room: Buffer.from(`${user.socketid}${overlap.socketid}/${qn}`).toString('base64'),
            sockdet: matchedDetail,
        };
    }
    return null;
}
