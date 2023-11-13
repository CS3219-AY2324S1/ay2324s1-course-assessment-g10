import { Interval } from "node-interval-tree";

export interface EngineMatch {
  user: string;
  room: string;
  questionId: string;
  isMaster: boolean;
}

export interface Match extends EngineMatch {
  init: boolean;
}

export interface RoomCloseResponse {
  reason: string;
  joinback: boolean;
  room?: EngineMatch;
}

export interface MatchRequest {
  username: string;
  preferredQn?: string;
  from: number;
  to: number;
}

export interface UserInterval extends Interval {
  user: string;
  preferredQn?: string;
}

export interface socketDetail {
  inQueue: boolean;
  UserDetail: UserInterval;
  connectionCount: number;
  match?: EngineMatch;
  countdown?: NodeJS.Timeout;
  joinbackTimer?: NodeJS.Timeout;
}
