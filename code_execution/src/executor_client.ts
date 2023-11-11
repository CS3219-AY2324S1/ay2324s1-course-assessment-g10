import axios from "axios";

const JUDGE_API_URL = 'http://judge0-server:2358/submissions';

async function submitCode(submission : any) {

    const response = await axios.post(`${JUDGE_API_URL}/batch`, { submissions: submission }, {
        headers: {
            "Content-Type": "application/json",
        },
        params: { base64_encoded: "true" }
    });

    const resTokens = response.data;

    const tokens = resTokens.map((tokenObj : { token: string})=> {
        return tokenObj["token"]
    })

    return tokens;
}

function pollStatusTillComplete(tokens: string[], resolve : any, reject : any, interval = 1000) {
    setTimeout(() => {
        const options = {
            params: {
                tokens: tokens.join(","),
                fields: "status_id"
            }
        }

        axios.get(`${JUDGE_API_URL}/batch`, options).then((response) => {

            const { submissions } = response.data;
            const pending = submissions.filter((submission : any) => submission.status_id === 1 || submission.status_id === 2)

            if (pending.length > 0) {
                pollStatusTillComplete(tokens, resolve, reject, interval);
            } else {
                resolve(submissions);
            }
        }).catch(reject);

    }, interval);
}

async function delSubmissions(tokens : string[]) {

    return await Promise.all(
        tokens.map(token => axios.delete(`${JUDGE_API_URL}/${token}`, {
            params: {fields: "status_id"},
            headers: {
                'X-Judge0-User': 'Auth-Judge0-User'
            }
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