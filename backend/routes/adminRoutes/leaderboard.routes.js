
import express from "express";
import db from "../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        COALESCE(up.current_level, 0) AS current_level
      FROM users u
      LEFT JOIN user_progress up ON u.user_id = up.user_id
      WHERE (u.role = 'user' OR u.role IS NULL)   -- 🔥 ADMIN REMOVED (also covers rows created before role was set at signup)
      ORDER BY current_level DESC, u.user_id ASC
      LIMIT 50
    `);

    res.json(rows);
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ message: "Leaderboard error" });
  }
});

export default router;

