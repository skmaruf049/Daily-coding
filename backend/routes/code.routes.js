import express from "express";
import {
  getLevels,
  getLevel,
  runCode,
  submitCode
} from "../controllers/code.controller.js";

const router = express.Router();

router.get("/levels/:userId", getLevels);
router.get("/level/:userId", getLevel);
router.post("/run", runCode);
router.post("/submit", submitCode);

export default router;
