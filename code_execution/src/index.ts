import express, { Request } from "express";
import bodyParser from "body-parser";
import { runSubmission } from "./executor_client";
import { callbacks } from "./shared";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const corsOptions = {
  origin: 'http://localhost:3000', //TODO: need to add our production url here once we host it. Currently assuming all requests will be made from this url
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

const app = express();
const port = process.env.PORT || 8090;

app.use(cors<Request>(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Checks for requests made to the /submit route
app.post("/api/code/submit", async (req, res) => {
  try {
    // Extracts these 4 variables
    const { lang, source_code, qn__id, uid } = req.body;
    const randid = uuidv4();

    runSubmission(randid, lang, qn__id, source_code, uid);
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

    res.json(response);
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
