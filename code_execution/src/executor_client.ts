import axios from "axios";
import { createBatchSubmission, getQnStdInOut } from "./testcases";
import { callbacks, langToId } from "./shared";
import { judge0Result, judge0submission, submissionResult } from "./types";
import { submitSubmission } from "./submission_client";

const JUDGE_API_URL = "http://judge0:2358"; //"https://judge0-ce.p.rapidapi.com";

async function submitIndividual(submission: judge0submission) {
  const response = await axios.post(
    `${JUDGE_API_URL}/submissions`,
    submission,
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: { base64_encoded: "true" },
    }
  );

  return response.data.token as string;
}

async function submitCode(submission: judge0submission[]) {
  const response = await axios.post(
    `${JUDGE_API_URL}/batch`,
    { submissions: submission },
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: { base64_encoded: "true" },
    }
  );

  const resTokens = response.data;

  const tokens = resTokens.map((tokenObj: { token: string }) => {
    return tokenObj["token"];
  });

  return tokens;
}

function pollIndividualTillComplete(
  token: string,
  resolve: any,
  reject: any,
  interval = 1000
) {
  setTimeout(() => {
    const options = {
      params: {
        fields: "status",
      },
    };

    axios
      .get(`${JUDGE_API_URL}/submissions/${token}`, options)
      .then((response) => {
        const { status } = response.data as judge0Result;
        if (status.id === 1 || status.id === 2) {
          pollIndividualTillComplete(token, resolve, reject, interval);
        } else {
          resolve(response.data as judge0Result);
        }
      })
      .catch(reject);
  }, interval);
}

function pollStatusTillComplete(
  tokens: string[],
  resolve: any,
  reject: any,
  interval = 1000
) {
  setTimeout(() => {
    const options = {
      params: {
        tokens: tokens.join(","),
        fields: "status_id",
      },
    };

    axios
      .get(`${JUDGE_API_URL}/batch`, options)
      .then((response) => {
        const { submissions } = response.data;
        const pending = submissions.filter(
          (submission: any) =>
            submission.status_id === 1 || submission.status_id === 2
        );

        if (pending.length > 0) {
          pollStatusTillComplete(tokens, resolve, reject, interval);
        } else {
          resolve(submissions);
        }
      })
      .catch(reject);
  }, interval);
}

async function delSubmissions(tokens: string[]) {
  return await Promise.all(
    tokens.map((token) =>
      axios.delete(`${JUDGE_API_URL}/${token}`, {
        params: { fields: "status_id" },
        headers: {
          "X-Judge0-User": "Auth-Judge0-User",
        },
      })
    )
  );
}

export async function individualExecute(submission: judge0submission) {
  try {
    const token = await submitIndividual(submission);

    const result = (await new Promise((resolve, reject) => {
      pollIndividualTillComplete(token, resolve, reject);
    })) as judge0Result;

    return result.status;
  } catch (error) {
    throw error;
  }
}

export async function execute(submissions: judge0submission[]) {
  try {
    const tokens = await submitCode(submissions);

    const result = await new Promise((resolve, reject) => {
      pollStatusTillComplete(tokens, resolve, reject);
    });
    await delSubmissions(tokens);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function runSubmission(
  id: string,
  lang: string,
  qn__id: string,
  source_code: string,
  userid: number
) {
  const submissionTime = new Date();
  const resDat: submissionResult = {
    completed: false,
    evaluated: 0,
    total: 0,
    verdict: "Unknown",
  };

  const language_id = langToId[lang];

  if (!language_id) throw new Error("Invalid language");
  callbacks[id] = resDat;

  const testcases = await getQnStdInOut(qn__id);
  resDat.total = testcases.length;

  const submissions = await createBatchSubmission(
    qn__id,
    language_id,
    source_code,
    testcases
  );

  for (const submission of submissions) {
    const res = await individualExecute(submission);
    resDat.evaluated += 1;
    resDat.verdict = res.description as submissionResult["verdict"];
    if (res.id !== 3) {
      break;
    }
  }

  resDat.verdict = resDat.verdict === "Unknown" ? "Accepted" : resDat.verdict;
  resDat.completed = true;

  submitSubmission(resDat.verdict, lang, qn__id, userid, source_code, submissionTime); // runs in the bg
}
