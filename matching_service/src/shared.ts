import { Mutex } from "async-mutex";
import { socketDetail } from "./types";

export const socketDetails: Record<string, socketDetail> = {};
export const sockToUser: Record<string, string> = {};