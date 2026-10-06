import express from "express";
import { sendFeedback } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", sendFeedback);

export default router;
