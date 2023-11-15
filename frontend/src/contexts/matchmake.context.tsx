import { io, Socket } from "socket.io-client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { selectUser } from "../reducers/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { wsMatchMakeURL } from "../api/gateway";
import { ToastId, useToast, UseToastOptions } from "@chakra-ui/react";

export interface Match {
  user: string;
  room: string;
  questionId: string;
  isMaster: boolean;
  init: boolean;
}

interface RoomCloseResponse {
  reason: string;
  joinback: boolean;
  match?: Match;
}

interface MatchmakeContextInterface {
  findMatch: (diffStart: number, diffEnd: number, qn__id?: string) => void;
  cancelMatch: () => void;
  quitRoom: () => void;
  disconnectRoom: () => void;
  restoreRoom: () => void;
  reloadRoom: () => void;
  isMatching: boolean;
  timeLeft?: number;
  matchedRoom?: Match;
}

const MatchmakeContext = createContext<MatchmakeContextInterface>({
  findMatch: () => {},
  cancelMatch: () => {},
  quitRoom: () => {},
  disconnectRoom: () => {},
  restoreRoom: () => {},
  reloadRoom: () => {},
  isMatching: false,
});

export const MatchmakeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedRoom, setMatchedRoom] = useState<Match>();
  const [socket, setSocket] = useState<Socket>();
  const [timeLeft, setTimeLeft] = useState<number>();

  const toast = useToast();
  const toastIdRef = React.useRef<ToastId>();

  const clearToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
      toastIdRef.current = undefined;
    }
  };

  const updateToast = (options: UseToastOptions) => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, options);
    } else {
      toastIdRef.current = toast(options);
    }
  };

  useEffect(() => {
    const socket = io(wsMatchMakeURL, {
      autoConnect: false,
    });
    setSocket(socket);

    socket.on("matchFound", (roomDetail: Match) => {
      clearToast();
      toast({
        title: "Match found",
        description: "Redirecting...",
        status: "success",
        duration: 2000,
      });
      setIsMatching(false);
      setMatchedRoom(roomDetail);
      navigate(`/view/${roomDetail.questionId}`);
    });

    socket.on("countdown", (countdown: number) => {
      setTimeLeft(countdown);
      updateToast({
        title: "Seeking worthy allies...",
        description: `Matching... ${countdown}`,
        status: "loading",
      });
    });

    socket.on("matchLeave", () => {
      setMatchedRoom(undefined);
      updateToast({
        title: "Match cancelled",
        description: "The other user has left the match",
        status: "error",
      });
    });

    socket.on("potentialMatch", () => {
      clearToast();
      updateToast({
        title: "Potential match found",
        description: "Waiting for confirmation...",
        status: "loading",
        colorScheme: "teal",
        duration: null,
      });
    });

    socket.on("restoreQueue", () => {
      toast({
        title: "Restoring...",
        description: "You are already in a queue",
        status: "loading",
        colorScheme: "orange",
        duration: 2000,
      });
    });

    socket.on("restoreMatch", (roomDetail: Match) => {
      clearToast();
      updateToast({
        title: "Restoring...",
        description: "You are already in a match",
        status: "success",
      });
      setIsMatching(false);
      setMatchedRoom(roomDetail);
      navigate(`/view/${roomDetail.questionId}`);
    });

    socket.on("matchEnded", (response: RoomCloseResponse) => {
      setMatchedRoom(response.match);
      if (!response.joinback) {
        toast({
          description: response.reason,
          status: "info",
          duration: 2000,
        });
        return;
      }
      toast({
        title: "Match ended",
        description: response.reason,
        status: "warning",
        duration: 2000,
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setTimeLeft(undefined);
      setMatchedRoom(undefined);
      setIsMatching(false);
      clearToast();
      socket.disconnect();
    });

    return () => {
      socket.off("matchFound");
      socket.off("matchLeave");
      socket.off("countdown");
      socket.off("isCancellable");
      socket.off("potentialMatch");
      socket.off("restoreQueue");
      socket.off("restoreMatch");
      socket.off("disconnect");
      setMatchedRoom(undefined);
      setTimeLeft(undefined);
      setIsMatching(false);
      clearToast();
      socket.disconnect();
    };
  }, [navigate, user]);

  const findMatch = (diffStart: number, diffEnd: number, qn__id?: string) => {
    if (!socket || !user) return;
    if (!socket.connected) socket.connect();

    setIsMatching(true);
    toastIdRef.current = toast({
      title: "Seeking worthy allies...",
      description: "Matching...",
      status: "loading",
      duration: null,
    });
    socket.emit("findMatch", {
      username: user.username,
      preferredQn: qn__id,
      from: diffStart,
      to: diffEnd,
    });
  };

  const cancelMatch = () => {
    if (!socket || !user) return;
    if (!socket.connected) return;
    socket.emit("cancelMatch");
  };

  const quitRoom = () => {
    if (!socket || !user) return;
    if (!socket.connected) return;
    socket.emit("quitRoom");
    navigate("/");
  };

  const disconnectRoom = () => {
    if (!socket || !user) return;
    if (!socket.connected) return;
    socket.disconnect();
  };

  const restoreRoom = () => {
    if (!socket || !user) return;
    if (!socket.connected) socket.connect();
    socket.emit("restore", user.username);
  };

  const reloadRoom = () => {
    if (!socket || !user || !socket.connected || !matchedRoom) return;
    console.log("attempting to reload");
    setMatchedRoom({
      ...matchedRoom,
    });
  };

  const memo = useMemo(() => {
    return {
      findMatch,
      cancelMatch,
      quitRoom,
      disconnectRoom,
      restoreRoom,
      reloadRoom,
      isMatching,
      matchedRoom,
      timeLeft,
    };
  }, [socket, user, isMatching, matchedRoom, timeLeft]);

  return (
    <MatchmakeContext.Provider value={memo}>
      {children}
    </MatchmakeContext.Provider>
  );
};

export const useMatchmake = () => useContext(MatchmakeContext);
