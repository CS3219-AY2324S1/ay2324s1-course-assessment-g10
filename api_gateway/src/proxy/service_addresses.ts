
export const isLocal = process.env.ENV_TYPE !== "docker";

export const questionServiceUrl = isLocal ? "http://localhost:8080" : "http://question-service:8080/";
export const userServiceHostUrl = isLocal ? "http://localhost:8081" : "http://user-service:8081/";
