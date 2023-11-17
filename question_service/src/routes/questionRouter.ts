import express from "express";
import {
  fetchAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestion,
  fetchARandomQuestion,
} from "../controller/questionController";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.get("/", fetchAllQuestions);
router.post("/", isAdmin, addQuestion);
router.get("/:id", fetchQuestion);
router.put("/:id", isAdmin, updateQuestion);
router.delete("/:id", isAdmin, deleteQuestion);
router.post("/random", fetchARandomQuestion);

export default router;
