import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { createBatchSubmission, getQnStdInOut } from "./testcases";

const app = express();
const port = process.env.PORT;

// Define the Judge0 API endpoint
const REACT_APP_RAPID_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const REACT_APP_RAPID_API_HOST = 'judge0-ce.p.rapidapi.com';
const REACT_APP_RAPID_API_KEY = '37be15bcc6msh436383ad7e63c94p1e682bjsna4ff7e6e3898';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Checks for requests made to the /submit route
app.post("/submit", async (req, res) => {
  try {

    // Extracts these 4 variables
    const { language_id, source_code, qn__id } = req.body;

    // Prepare the data to be sent to Judge0
    const testcases = await getQnStdInOut(qn__id);
    const data = createBatchSubmission(qn__id, language_id, source_code, testcases);

    console.log(data);
    // Send a POST request to Judge0
    const response = await axios.post(REACT_APP_RAPID_API_URL, data, {
      headers: {
        "Content-Type": "application/json",
        "content-type": "application/json",
        "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": REACT_APP_RAPID_API_KEY,
      },
    });

    // Send the Judge0 response back to the client
    res.json(response.data.token);
    console.log(response.data.token);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/result/:token", async (req, res) => {
  try {
    const token = req.params.token;

    // Define the Judge0 API endpoint for status
    const statusEndpoint = `${REACT_APP_RAPID_API_URL}/${token}`;
    console.log(statusEndpoint);
    const options = {
      method: "GET",
      url: statusEndpoint,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": REACT_APP_RAPID_API_KEY,
      },
    };

    const result = await axios.request(options);
    const statusId = result.data.status?.id;
    // Send the status response back to the client

    if (statusId === 3) {
      console.log("status:", result.data.status?.id);
      console.log("result:", atob(result.data.stdout));
      
      const testResult = {
        statusId: statusId,
        output: atob(result.data.stdout),
      };
  
      res.json(testResult);
    } else if (statusId === 6) {
      console.log("status:", result.data.status?.id);
      console.log("result:", result.data.compile_output);

      const testResult = {
        statusId: statusId,
        output: atob(result.data.compile_output),
      };
      
      console.log("statusID: ", testResult.statusId);
      res.json(testResult);
    } else {
      console.log("status:", result.data.status?.id);
      console.log("result:", result.data.status?.description);
      
      const testResult = {
        statusId: statusId,
        output: atob(result.data.status?.description),
      };
      
      res.json(testResult);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
