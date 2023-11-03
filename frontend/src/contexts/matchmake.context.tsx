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
import { ToastId, useToast } from "@chakra-ui/react";

export interface Match {
  user: string;
  room: string;
  questionId: string;
  init: boolean;
}

interface MatchmakeContextInterface {
  findMatch: (diffStart: number, diffEnd: number) => void;
  cancelMatch: () => void;
  isMatching: boolean;
  timeLeft?: number;
  matchedRoom?: Match;
}

const MatchmakeContext = createContext<MatchmakeContextInterface>({
  findMatch: () => {},
  cancelMatch: () => {},
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

  useEffect(() => {
    const socket = io("ws://localhost:8082", {
      autoConnect: false,
    });
    setSocket(socket);

    socket.on("matchFound", (roomDetail: Match) => {
      toast({
        title: "Match found",
        description: "Redirecting...",
        status: "success",
      });
      setIsMatching(false);
      setMatchedRoom(roomDetail);
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toastIdRef.current = undefined;
      navigate(`/view/${roomDetail.questionId}`);
    });

    socket.on("countdown", (countdown: number) => {
      setTimeLeft(countdown);
      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          title: "Seeking worthy allies...",
          description: `Matching... ${countdown}`,
          status: "loading",
        });
      } else {
        toastIdRef.current = toast({
          title: "Seeking worthy allies...",
          description: `Matching... ${countdown}`,
          status: "loading",
        });
      }
    });
    socket.on("matchLeave", () => {
      setMatchedRoom(undefined);
      toast({
        title: "Match cancelled",
        description: "The other user has left the match",
        status: "error",
      });
    });

    socket.on("disconnect", () => {
      setTimeLeft(undefined);
      setMatchedRoom(undefined);
      setIsMatching(false);
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
        toastIdRef.current = undefined;
      }
      socket.disconnect();
    });

    return () => {
      socket.off("matchFound");
      socket.off("matchLeave");
      socket.off("countdown");
      socket.off("isCancellable");
      socket.off("disconnect");

      socket.disconnect();
    };
  }, [navigate, user]);

  const findMatch = (diffStart: number, diffEnd: number) => {
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
      from: diffStart,
      to: diffEnd,
    });
  };

  const cancelMatch = () => {
    if (!socket || !user) return;
    if (!socket.connected) return;
    socket.emit("cancelMatch");
  };

  const memo = useMemo(() => {
    return {
      findMatch,
      cancelMatch,
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
