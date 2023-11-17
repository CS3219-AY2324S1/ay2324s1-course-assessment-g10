import { IntervalTree } from "node-interval-tree";
import { UserInterval, socketDetail } from "./types";
import { fetchRandQn } from "./communication";
import { socketDetails } from "./shared";

const tree = new IntervalTree<UserInterval>();

export const addInterval = (interval: UserInterval) => tree.insert(interval);
export const removeInterval = (interval: UserInterval) => tree.remove(interval);
export const printQueue = () => {
  console.log("queue status:", tree.search(-Infinity, Infinity));
}
export const findOverlaps = (low: number, high: number) =>
  tree.search(low, high);
const overlapOf = (
  matcher: UserInterval,
  matchedWith: UserInterval
): UserInterval => {
  return {
    low: Math.max(matcher.low, matchedWith.low),
    high: Math.min(matcher.high, matchedWith.high),
    user: matchedWith.user,
    preferredQn: matcher.preferredQn ?? matchedWith.preferredQn,
  };
};

export const findMatch = (user: UserInterval): UserInterval | null => {
  const overlaps = findOverlaps(user.low, user.high);
  for (const overlap of overlaps) {
    if (
      user.preferredQn &&
      overlap.preferredQn &&
      user.preferredQn !== overlap.preferredQn
    )
      continue;

    let res = false;
    let matchedDetail: socketDetail | undefined = undefined;

    // no interleaving between sync blocks in Nodejs
    matchedDetail = socketDetails[overlap.user];
    const detail = socketDetails[user.user];
    if (!matchedDetail?.inQueue) continue; // found user left/disconnected
    if (!detail) return null; // users has cancelled/disconnected

    res = removeInterval(overlap);
    res = res && (matchedDetail.inQueue ?? false);
    // we have found a match
    return overlapOf(user, overlap);
  }
  return null;
};

export const createMatch = async (potMatch: UserInterval, uid: number) => {
  // interleaving can occur here
  const qn =
    potMatch.preferredQn ??
    (await fetchRandQn(potMatch.low, potMatch.high)) ??
    "";
  // we assume we would always find a qn here

  return {
    questionId: qn,
    room: Buffer.from(`${uid}${potMatch.user}/${qn}`).toString("base64"),
    userId: potMatch.user,
  };
};
