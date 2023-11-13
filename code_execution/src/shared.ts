export type submissionResult = {
  evaluated: number;
  total: number;
  verdict:
    | "Accepted"
    | "TLE"
    | "MLE"
    | "WA"
    | "Compile Error"
    | "Runtime Error";
  completed: boolean;
};

export type callbackMapping = Record<string, submissionResult>;

export type exuctionResult = {
  stdout: string;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: null;
  message: null;
  status: {
    id: 3;
    description: "Accepted";
  };
};

export const callbacks: callbackMapping = {};
