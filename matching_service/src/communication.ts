import axios from "axios";

const questionServiceClient = axios.create({
  baseURL: "http://question-service:8080",
  withCredentials: true,
});

export const fetchRandQn = async (low: number, high: number) => {
  const res = await questionServiceClient.post("/api/questions/random", {
    from: low,
    to: high,
  });

  return res.data.id;
};
