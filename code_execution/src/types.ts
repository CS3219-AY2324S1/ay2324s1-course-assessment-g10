export type submissionResult = {
  evaluated: number;
  total: number;
  verdict:
    | "Accepted"
    | "TLE"
    | "MLE"
    | "WA"
    | "Compile Error"
    | "Runtime Error"
    | "Unknown";
  completed: boolean;
};

export type judge0Result = {
  status: {
    id: number;
    description: string;
  };
};

export type judge0submission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
};

export type callbackMapping = Record<string, submissionResult>;
