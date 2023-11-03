import { Mutex } from "async-mutex";
import { socketDetail } from "./types";

export const lock = new Mutex();
export const socketDetails: Record<string, socketDetail> = {};
