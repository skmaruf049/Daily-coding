import express from "express";
import db from "../../db.js";

const router = express.Router();

/* =========================
   GET ALL PROBLEMS WITH TEST CASES
========================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        l.id,
        l.level_no,
        l.title,
        l.difficulty,
        COUNT(tc.id) AS test_case_count,
        GROUP_CONCAT(
          CONCAT(
            'Input: ', tc.input_data,
            ' → Output: ', tc.expected_output
          )
          SEPARATOR '\\n'
        ) AS test_cases
      FROM levels l
      LEFT JOIN test_cases tc 
        ON l.id = tc.level_id      -- ✅ FIX HERE
      GROUP BY l.id, l.level_no, l.title, l.difficulty
      ORDER BY l.level_no ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("PROBLEMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE PROBLEM
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM levels WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
