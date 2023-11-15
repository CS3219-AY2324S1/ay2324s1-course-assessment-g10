import { apiGatewayClient } from "./gateway";

export async function submitCodeForExecution(data_payload: any) {
    const res = await apiGatewayClient.post("/api/code/submit", data_payload);

    return res;
}

export async function getExecutionResult(token : string) {
    const res = await apiGatewayClient.get(`/api/code/result/${token}`);

    return res;
}