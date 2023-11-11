
export const isLocal = process.env.ENV_TYPE !== "docker";

export const questionServiceUrl = isLocal ? "http://localhost:8080" : "http://question-service:8080/";
export const userServiceHostUrl = isLocal ? "http://localhost:8081" : "http://user-service:8081/";
export const matchServiceHostUrl = isLocal ? "http://localhost:8082" : "http://matching-service:8082"
export const collabServiceHostUrl = isLocal ? "http://localhost:8083" : "http://collab-service:8083"