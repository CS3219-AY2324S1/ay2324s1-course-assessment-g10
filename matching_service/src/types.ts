import { Interval } from "node-interval-tree";

export interface EngineMatch {
  user: string;
  room: string;
  questionId: string;
}

export interface Match extends EngineMatch {
  init: boolean;
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
}
