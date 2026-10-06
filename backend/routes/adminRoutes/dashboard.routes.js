import express from "express";
import db from "../../db.js";
import { ensureSubmissionsTable } from "../../controllers/code.controller.js";
const router = express.Router();

/* =========================
   DASHBOARD COUNTS API
========================= */
router.get("/counts", async (req, res) => {
  try {
    await ensureSubmissionsTable(); // FIX: table only existed after a submit; guarantee it first
    const [[users]] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [[problems]] = await db.query("SELECT COUNT(*) AS total FROM levels");
   // const [[submissions]] = await db.query("SELECT COUNT(*) AS total FROM submissions");
     const [[leaderboard]] = await db.query(
      "SELECT COUNT(DISTINCT user_id) AS total FROM submissions"
    );
    const [[feedback]] = await db.query("SELECT COUNT(*) AS total FROM feedback");
    res.json({
      users: users.total,
      problems: problems.total,
      leaderboard: leaderboard.total,
      //submissions: submissions.total,
      feedback: feedback.total
    });
  } catch (err) {
    console.error("Counts Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECENT SUBMISSIONS API
========================= */
router.get("/recent-submissions", async (req, res) => {
  try {
    await ensureSubmissionsTable(); // FIX: table only existed after a submit; guarantee it first
    const [rows] = await db.query(`
      SELECT 
        u.name AS user_name,
        l.title AS problem_title,
        s.status,
        s.language,
        s.created_at
      FROM submissions s
      JOIN users u ON u.user_id = s.user_id
      JOIN levels l ON l.id = s.level_id
      ORDER BY s.created_at DESC
      LIMIT 5
    `);

    res.json(rows);
  } catch (err) {
    console.error("Recent Submissions Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
