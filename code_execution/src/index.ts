import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { createBatchSubmission, getQnStdInOut } from "./testcases";
import { execute } from "./executor_client";

const app = express();
const port = process.env.PORT;

// Define the Judge0 API endpoint
const JUDGE_API_URL = 'judge0-server:2358/submissions';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Checks for requests made to the /submit route
app.post("/api/code/submit", async (req, res) => {
  try {

    // Extracts these 4 variables
    const { language_id, source_code, qn__id } = req.body;

    // Prepare the data to be sent to Judge0
    const testcases = await getQnStdInOut(qn__id);
    const submission = await createBatchSubmission(qn__id, language_id, source_code, testcases);

    const result = await execute(submission);

    // Send the Judge0 response back to the client
    res.json(result);
    console.log(result);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
