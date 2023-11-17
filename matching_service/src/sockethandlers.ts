import { Server, Socket } from "socket.io";
import {
  Match,
  MatchRequest,
  RoomCloseResponse,
  UserInterval,
  socketDetail,
} from "./types";
import { addInterval, createMatch, findMatch, printQueue, removeInterval } from "./engine";
import { sockToUser, socketDetails } from "./shared";

const removeUser = (
  io: Server,
  user: number,
  allowJoinbackIfInMatch: boolean = false
) => {
  const detail = socketDetails[user];
  if (!detail) return;
  if (!detail.match || !allowJoinbackIfInMatch) {
    if (detail.UserDetail) removeInterval(detail.UserDetail);
    if (detail.countdown) clearInterval(detail.countdown);
    if (detail.joinbackTimer) clearTimeout(detail.joinbackTimer);
    delete socketDetails[user];
    console.log("disconnecting all instances of", user);
    io.in(user.toString()).disconnectSockets();
    return;
  }

  if (--detail.connectionCount > 0) return; // user is still connected in other sockets
  // user in match, but disconnected
  const match = detail.match;

  // promote the other user the master to handle submission event
  match.isMaster = false;
  const matchedDetail = socketDetails[match.userId];

  if (matchedDetail?.joinbackTimer) {
    // the other user disconnected too, so we just remove both
    removeUser(io, user);
    removeUser(io, match.userId);
    return;
  }

  let opponentRoom = matchedDetail?.match;
  if (opponentRoom && !opponentRoom.isMaster) {
    opponentRoom.isMaster = true;
  }

  // match.user is the user that is matched with
  io.to(match.userId.toString()).emit("matchEnded", {
    joinback: true,
    reason: "Opponent disconnected",
    match: opponentRoom,
  } as RoomCloseResponse);

  detail.joinbackTimer = setTimeout(() => {
    removeUser(io, user);
    io.to(match.userId.toString()).emit("matchEnded", {
      joinback: false,
      reason: "Opponent did not join back",
    } as RoomCloseResponse);
    removeUser(io, match.userId);
  }, 10000);
};

// restore user to queue or match
const restore = (socket: Socket, user: number) => {
  console.log("restore match received from", socket.id, "for", user);
  const detail = socketDetails[user];
  if (!detail) return false;

  socket.join(user.toString());
  sockToUser[socket.id] = user;
  detail.connectionCount++;
  if (!detail.match) {
    socket.emit("restoreQueue");
    return true;
  }
  if (detail.joinbackTimer) clearTimeout(detail.joinbackTimer);
  detail.joinbackTimer = undefined;

  socket.emit("restoreMatch", {
    ...detail.match,
    init: false,
  } as Match);
  return true;
};

const remove = (io: Server, socket: Socket, disconnect: boolean = false) => {
  // no interleaving between sync blocks in Nodejs
  console.log("disconnect/cancelMatch received from", socket.id);
  const user = sockToUser[socket.id];
  delete sockToUser[socket.id];

  if (!user) return; // user already been removed/cleared
  removeUser(io, user, disconnect);
  printQueue();
};

const quitRoom = (io: Server, socket: Socket) => {
  console.log("quitRoom received from", socket.id);
  const user = sockToUser[socket.id];
  if (!user) return;
  const match = socketDetails[user]?.match;
  if (!match) return; // this shouldnt happen, but safe guard
  removeUser(io, user);
  printQueue();
  io.to(match.userId.toString()).emit("matchEnded", {
    joinback: false,
    reason: "Opponent left the room",
  } as RoomCloseResponse);
  removeUser(io, match.userId);
};

const handleMatchRequest = async (
  io: Server,
  socket: Socket,
  req: MatchRequest
) => {
  console.log(`Match request received from ${req.uid}`);

  if (restore(socket, req.uid)) return;
  // no interleaving between sync blocks in Nodejs
  let detail: socketDetail = {
    UserDetail: {
      low: req.from,
      high: req.to,
      preferredQn: req.preferredQn,
      user: req.uid,
    },
    countdown: undefined,
    inQueue: false,
    connectionCount: 1,
  };
  socketDetails[req.uid] = detail;
  sockToUser[socket.id] = req.uid;
  socket.join(req.uid.toString());

  let userInterval: UserInterval | undefined = detail.UserDetail;

  while (userInterval) {
    const potMatch = findMatch(userInterval);

    // no interleaving between sync blocks in Nodejs
    if (!potMatch) {
      // no match found, adding to interval tree
      console.log("Adding user to engine:", userInterval.user);
      addInterval(userInterval);
      printQueue();
      detail.inQueue = true;
      let countdown = 29;
      const userDet = detail;
      detail.countdown = setInterval(async () => {
        if (countdown === 0) {
          remove(io, socket);
          clearInterval(userDet.countdown);
          return;
        }
        io.to(userDet.UserDetail.user.toString()).emit(
          "countdown",
          countdown--
        );
      }, 1000);
      return;
    }

    io.to([potMatch.user.toString(), userInterval.user.toString()]).emit(
      "potentialMatch"
    );
    console.log("Potential match found! >>> ", [potMatch.user.toString(), userInterval.user.toString()])
    printQueue();

    let matchedUserDetail = socketDetails[potMatch.user];
    if (!matchedUserDetail) continue; // this shouldnt happen, but safe guard

    // connected user doesnt have a timer at this point
    clearInterval(matchedUserDetail.countdown);
    matchedUserDetail.countdown = undefined;

    const match = await createMatch(potMatch, userInterval.user);

    detail.match = {
      // update for this socker user
      ...match,
      isMaster: true,
    };
    matchedUserDetail = socketDetails[match.userId];

    // matched user left/disconnected
    if (!matchedUserDetail) continue;

    if (!socketDetails[userInterval.user]) {
      // this user has let the queue
      // we now need to rematch the matched user
      detail = matchedUserDetail;
      userInterval = matchedUserDetail.UserDetail;
      continue;
    }
    matchedUserDetail.match = {
      // update for matched user from interval tree
      ...match,
      userId: userInterval.user,
      isMaster: false,
    };

    console.log("Match found!! >>> ", [potMatch.user.toString(), userInterval.user.toString()]);
    // update for this user from this socket
    io.to(userInterval.user.toString())
      // .except(socket.id)
      .emit("matchFound", {
        ...detail.match,
        init: true,
      } as Match);

    // update for matched partner from this socket
    io.to(match.userId.toString()).emit("matchFound", {
      ...matchedUserDetail.match,
      init: false,
    } as Match);

    // socket.emit("matchFound", {
    //   ...detail.match,
    //   init: true,
    // } as Match);

    return;
  }
};

export const handleConnection = (io: Server, socket: Socket) => {
  socket.on("findMatch", (req) => handleMatchRequest(io, socket, req));
  socket.on("cancelMatch", () => remove(io, socket));
  socket.on("quitRoom", () => quitRoom(io, socket));
  socket.on("restore", (user) => restore(socket, user));
  socket.on("disconnect", () => remove(io, socket, true));
};
