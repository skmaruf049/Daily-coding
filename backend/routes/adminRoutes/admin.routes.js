import express from "express";
//import db from "../../db.js";
import { createLevelWithTestCases } from "../../controllers/admin.controller.js";

const router = express.Router();

router.post("/level", createLevelWithTestCases);

export default router;
