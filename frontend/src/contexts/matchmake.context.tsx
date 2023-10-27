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
import { useToast } from "@chakra-ui/react";

interface RoomDetail {
  partner: string;
  host: string;
  qn: string;
}

interface MatchmakeContextInterface {
  findMatch: (diffStart: number, diffEnd: number) => void;
  cancelMatch: () => void;
  isMatching: boolean;
  matchedRoom?: RoomDetail;
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
  const [matchedRoom, setMatchedRoom] = useState<RoomDetail>();
  const [socket, setSocket] = useState<Socket>();

  const toast = useToast();

  useEffect(() => {
    const socket = io("ws://localhost:8082", {
      autoConnect: false,
    });
    setSocket(socket);

    socket.on("matchFound", (roomDetail: RoomDetail) => {
      toast({
        title: "Match found",
        description: `You have been partnered with ${roomDetail.partner}`,
        status: "success",
      });
      setIsMatching(false);
      setMatchedRoom(roomDetail);
      navigate(`/collab`);
    });

    socket.on("matchLeave", () => {
      setMatchedRoom(undefined);
      toast({
        title: "Match cancelled",
        description: "The other user has left the match",
        status: "error",
      });
    });

    return () => {
      socket.off("matchFound");
      socket.off("matchLeave");
      socket.disconnect();
    };
  }, []);

  const findMatch = (diffStart: number, diffEnd: number) => {
    if (!socket || !user) return;
    if (!socket.connected) socket.connect();

    setIsMatching(true);
    toast({
      title: "Seeking worthy allies...",
      status: "loading",
    });
    socket.emit("findMatch", {
      id: user.username,
      difficultyFrom: diffStart,
      difficultyTo: diffEnd,
    });
  };

  const cancelMatch = () => {
    if (!socket || !user) return;
    if (!socket.connected) return;

    setIsMatching(false);
    socket.emit("cancelMatch", {
      username: user.username,
    });
  };

  const memo = useMemo(() => {
    return {
      findMatch,
      cancelMatch,
      isMatching,
      matchedRoom,
    };
  }, [socket, user, isMatching, matchedRoom]);

  return (
    <MatchmakeContext.Provider value={memo}>
      {children}
    </MatchmakeContext.Provider>
  );
};

export const useMatchmake = () => useContext(MatchmakeContext);
