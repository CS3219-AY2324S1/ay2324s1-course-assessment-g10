const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Define the Judge0 API endpoint
const REACT_APP_RAPID_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const REACT_APP_RAPID_API_HOST = 'judge0-ce.p.rapidapi.com';
const REACT_APP_RAPID_API_KEY = '37be15bcc6msh436383ad7e63c94p1e682bjsna4ff7e6e3898';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/execute", async (req, res) => {
  try {
    const { language_id, source_code, stdin } = req.body;

    // Prepare the data to be sent to Judge0
    const data = {
      language_id,
      source_code: Buffer.from(source_code, "base64").toString("utf-8"),
      stdin: Buffer.from(stdin, "base64").toString("utf-8"),
    };

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
    res.json(response.data);

    // Check the statusId in the response
    const statusId = response.data.status?.id;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/status/:token", async (req, res) => {
  try {
    const token = req.params.token;

    // Define the Judge0 API endpoint for status
    const statusEndpoint = `${REACT_APP_RAPID_API_URL}/${token}`;
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
      res.json(atob(result.data.stdout));
    } else if (statusId === 6) {
      console.log("status:", result.data.status?.id);
      console.log("result:", result.data.compile_output);
      res.json(atob(result.data.compile_output));
    } else {
      console.log("status:", result.data.status?.id);
      console.log("result:", result.data.status?.description);
      res.json(result.data.status?.description);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
