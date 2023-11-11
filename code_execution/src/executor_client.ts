import axios from "axios";

const JUDGE_API_URL = 'judge0-server:2358/submissions';

async function submitCode(submission) {

    const response = await axios.post(`${JUDGE_API_URL}/batch`, submission, {
        headers: {
            "Content-Type": "application/json",
        },
        params: { base64_encoded: "true" }
    });

    const resTokens = response.data;

    const tokens = resTokens.map(tokenObj => {
        return tokenObj["token"]
    })

    return tokens;
}

function pollStatusTillComplete(tokens: string[], resolve, reject, interval = 1000) {
    setTimeout(() => {
        const options = {
            params: {
                tokens: tokens.join(","),
                fields: "status_id"
            }
        }

        axios.get(`${JUDGE_API_URL}/batch`, options).then((response) => {

            const { submissions } = response.data;
            const pending = submissions.filter((submission) => submission.status_id === 1 || submission.status_id === 2)

            if (pending.length > 0) {
                pollStatusTillComplete(tokens, resolve, reject, interval);
            } else {
                resolve(submissions);
            }
        }).catch(reject);

    }, interval);
}

async function delSubmissions(tokens) {

    return await Promise.all(
        tokens.map(token => axios.delete(`${JUDGE_API_URL}/${token}`, {
            params: {fields: "status_id"}
    })))
}

export async function execute(submission: any) {

    try {
        const tokens = await submitCode(submission);
    
        const result = await new Promise((resolve, reject) => {
            pollStatusTillComplete(tokens, resolve, reject);
        })
        await delSubmissions(tokens);
        
        return result;
    } catch (error) {
        throw error;
    }

}