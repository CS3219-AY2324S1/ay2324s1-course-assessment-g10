import { Server, Socket } from "socket.io";
import { Match, MatchRequest, UserInterval, socketDetail } from "./types";
import { addInterval, createMatch, findMatch, removeInterval } from "./engine";
import { sockToUser, socketDetails } from "./shared";

const remove = async (io: Server, socket: Socket) => {
  // no interleaving between sync blocks in Nodejs
  console.log("disconnect/cancelMatch received from", socket.id);
  const user = sockToUser[socket.id];
  delete sockToUser[socket.id];

  if (!user) return;
  console.log("removing user", user);
  const detail = socketDetails[user];
  if (detail?.UserDetail) removeInterval(detail.UserDetail);
  if (detail?.countdown) clearInterval(detail.countdown);
  delete socketDetails[user];
  socket.disconnect();
};

const handleMatchRequest = async (
  io: Server,
  socket: Socket,
  req: MatchRequest
) => {
  console.log(`Match request received from ${req.username}`);
  let detail: socketDetail | undefined = undefined;
  let newRoom = false;
  socket.join(req.username);

  // no interleaving between sync blocks in Nodejs
  detail = socketDetails[req.username];
  if (!detail) {
    newRoom = true;
    detail = {
      UserDetail: {
        low: req.from,
        high: req.to,
        preferredQn: req.preferredQn,
        user: req.username,
      },
      countdown: undefined,
      inQueue: false,
      connectionCount: 0,
    };
    socketDetails[req.username] = detail;
  }
  detail.connectionCount++;
  sockToUser[socket.id] = req.username;
  if (detail.match) {
    // if user in match, join back the room
    socket.emit("restoreMatch", {
      ...detail.match,
      init: false,
    } as Match);
    return;
  }

  if (!newRoom) return socket.emit("retoreQueue");

  // new user in queue
  let userDetail: UserInterval | undefined = detail.UserDetail;

  while (userDetail) {
    const potMatch = findMatch(userDetail);

    // no interleaving between sync blocks in Nodejs
    if (!potMatch) {
      // no match found, adding to interval tree
      console.log("Adding user to engine:", userDetail.user);
      addInterval(userDetail);
      detail.inQueue = true;
      let countdown = 29;
      detail.countdown = setInterval(async () => {
        if (countdown === 0) {
          remove(io, socket);
          clearInterval(detail?.countdown);
          return;
        }
        socket.emit("countdown", countdown--);
      }, 1000);
      return;
    }

    io.to([potMatch.user, userDetail.user]).emit("potentialMatch");

    let matchedUserDetail = socketDetails[potMatch.user];
    if (!matchedUserDetail) continue; // this shouldnt happen, but safe guard

    // connected user doesnt have a timer at this point
    clearInterval(matchedUserDetail.countdown);
    matchedUserDetail.countdown = undefined;

    const match = await createMatch(potMatch, userDetail.user);

    detail.match = match;
    matchedUserDetail = socketDetails[match.user];

    // matched user left/disconnected
    if (!matchedUserDetail) continue;

    if (!socketDetails[userDetail.user]) {
      // this user has let the queue
      // we now need to rematch the matched user
      detail = matchedUserDetail;
      userDetail = matchedUserDetail.UserDetail;
      continue;
    }
    matchedUserDetail.match = {
      ...match,
      user: userDetail.user,
    };

    io.to(userDetail.user).emit("matchFound", {
      ...detail.match,
      init: true,
    } as Match);

    io.to(match.user).emit("matchFound", {
      ...matchedUserDetail.match,
      init: false,
    } as Match);

    return;
  }
};

export const handleConnection = (io: Server, socket: Socket) => {
  socket.on("findMatch", (req) => handleMatchRequest(io, socket, req));
  socket.on("cancelMatch", () => remove(io, socket));
  socket.on("disconnect", () => remove(io, socket));
};
