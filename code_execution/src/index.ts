import express from "express";
import bodyParser from "body-parser";
import { runSubmission } from "./executor_client";
import { callbacks } from "./shared";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 8090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Checks for requests made to the /submit route
app.post("/api/code/submit", async (req, res) => {
  try {
    // Extracts these 4 variables
    const { lang, source_code, qn__id, uids } = req.body;
    const randid = uuidv4();

    runSubmission(randid, lang, qn__id, source_code, uids);
    res.json({ token: randid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// requests for result for a particular submission
app.get("/api/code/result/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "id not found" });
    }

    const response = callbacks[token];
    if (!response) {
      return res.status(400).json({ error: "id not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// delete a particular submission
app.delete("/api/code/result/:token", async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "id not found" });
    }

    const response = callbacks[token];
    if (!response) {
      return res.status(400).json({ error: "id not found" });
    }

    delete callbacks[token];
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
