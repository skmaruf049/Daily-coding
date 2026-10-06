import express from "express";
import db from "../../db.js";
import { ensureSubmissionsTable } from "../../controllers/code.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await ensureSubmissionsTable(); // FIX: table only existed after a submit; guarantee it first
    const [rows] = await db.query(`
      SELECT 
        u.name AS user_name,
        l.title AS problem_title,
        s.status,
        s.language
      FROM submissions s
      JOIN users u ON u.user_id = s.user_id
      JOIN levels l ON l.id = s.level_id
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
