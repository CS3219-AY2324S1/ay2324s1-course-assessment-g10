import { Server, Socket } from "socket.io";
import {
  Match,
  MatchRequest,
  RoomCloseResponse,
  UserInterval,
  socketDetail,
} from "./types";
import { addInterval, createMatch, findMatch, removeInterval } from "./engine";
import { sockToUser, socketDetails } from "./shared";

const removeUser = (
  io: Server,
  user: string,
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
    io.in(user).disconnectSockets();
    return;
  }

  if (--detail.connectionCount > 0) return; // user is still connected in other sockets
  // user in match, but disconnected
  const match = detail.match;

  // promote the other user the master to handle submission event
  match.isMaster = false;
  const matchedDetail = socketDetails[match.user];

  if (matchedDetail?.joinbackTimer) {
    // the other user disconnected too, so we just remove both
    removeUser(io, user);
    removeUser(io, match.user);
    return;
  }

  let opponentRoom = matchedDetail?.match;
  if (opponentRoom && !opponentRoom.isMaster) {
    opponentRoom.isMaster = true;
  }

  // match.user is the user that is matched with
  io.to(match.user).emit("matchEnded", {
    joinback: true,
    reason: "Opponent disconnected",
    match: opponentRoom,
  } as RoomCloseResponse);

  detail.joinbackTimer = setTimeout(() => {
    removeUser(io, user);
    io.to(match.user).emit("matchEnded", {
      joinback: false,
      reason: "Opponent did not join back",
    } as RoomCloseResponse);
    removeUser(io, match.user);
  }, 10000);
};

// restore user to queue or match
const restore = (socket: Socket, user: string) => {
  console.log("restore match received from", socket.id, "for", user);
  const detail = socketDetails[user];
  if (!detail) return false;

  socket.join(user);
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
};

const quitRoom = (io: Server, socket: Socket) => {
  console.log("quitRoom received from", socket.id);
  const user = sockToUser[socket.id];
  if (!user) return;
  const match = socketDetails[user]?.match;
  if (!match) return; // this shouldnt happen, but safe guard
  removeUser(io, user);
  io.to(match.user).emit("matchEnded", {
    joinback: false,
    reason: "Opponent left the room",
  } as RoomCloseResponse);
  removeUser(io, match.user);
};

const handleMatchRequest = async (
  io: Server,
  socket: Socket,
  req: MatchRequest
) => {
  console.log(`Match request received from ${req.username}`);

  if (restore(socket, req.username)) return;
  // no interleaving between sync blocks in Nodejs
  let detail: socketDetail = {
    UserDetail: {
      low: req.from,
      high: req.to,
      preferredQn: req.preferredQn,
      user: req.username,
    },
    countdown: undefined,
    inQueue: false,
    connectionCount: 1,
  };
  socketDetails[req.username] = detail;
  sockToUser[socket.id] = req.username;
  socket.join(req.username);

  let userInterval: UserInterval | undefined = detail.UserDetail;

  while (userInterval) {
    const potMatch = findMatch(userInterval);

    // no interleaving between sync blocks in Nodejs
    if (!potMatch) {
      // no match found, adding to interval tree
      console.log("Adding user to engine:", userInterval.user);
      addInterval(userInterval);
      detail.inQueue = true;
      let countdown = 29;
      const userDet = detail;
      detail.countdown = setInterval(async () => {
        if (countdown === 0) {
          remove(io, socket);
          clearInterval(userDet.countdown);
          return;
        }
        io.to(userDet.UserDetail.user).emit("countdown", countdown--);
      }, 1000);
      return;
    }

    io.to([potMatch.user, userInterval.user]).emit("potentialMatch");

    let matchedUserDetail = socketDetails[potMatch.user];
    if (!matchedUserDetail) continue; // this shouldnt happen, but safe guard

    // connected user doesnt have a timer at this point
    clearInterval(matchedUserDetail.countdown);
    matchedUserDetail.countdown = undefined;

    const match = await createMatch(potMatch, userInterval.user);

    detail.match = {
      ...match,
      isMaster: true,
    };
    matchedUserDetail = socketDetails[match.user];

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
      ...match,
      user: userInterval.user,
      isMaster: false,
    };

    io.to(userInterval.user)
      .except(socket.id)
      .emit("matchFound", {
        ...matchedUserDetail.match,
        init: false,
      } as Match);

    io.to(match.user).emit("matchFound", {
      ...detail.match,
      init: false,
    } as Match);

    socket.emit("matchFound", {
      ...detail.match,
      init: true,
    } as Match);

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
