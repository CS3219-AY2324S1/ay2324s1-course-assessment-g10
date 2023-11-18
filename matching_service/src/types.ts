import { Interval } from "node-interval-tree";

export interface EngineMatch {
  userId: number;
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
  uid: number;
  preferredQn?: string;
  from: number;
  to: number;
}

export interface UserInterval extends Interval {
  user: number;
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
