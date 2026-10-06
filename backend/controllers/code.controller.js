import db from "../db.js";
import axios from "axios";
const JUDGE0_URL = "https://ce.judge0.com";
const LANG_MAP = {
  python: { lang: "python", version: "3.10.0", file: "main.py", judge0Id: 71 },
  javascript: { lang: "javascript", version: "18.15.0", file: "main.js", judge0Id: 63 },
  c: { lang: "c", version: "10.2.0", file: "main.c", judge0Id: 50 },
  cpp: { lang: "cpp", version: "10.2.0", file: "main.cpp", judge0Id: 54 },
};

/* FIX: nothing previously wrote to `submissions`, so the admin
   Submissions / Recent-submissions pages queried an always-empty (or
   nonexistent) table. This logs every submit attempt. Uses
   CREATE TABLE IF NOT EXISTS so it self-heals if the table is missing —
   and also patches in any columns a pre-existing `submissions` table
   (from before this fix, e.g. still using an old `problem_id` layout)
   might be missing, since CREATE TABLE IF NOT EXISTS does nothing to a
   table that already exists. */
let submissionsTableReady = false;
const REQUIRED_SUBMISSION_COLUMNS = {
  user_id: "INT NULL",
  level_id: "INT NULL",
  language: "VARCHAR(20) NULL",
  status: "VARCHAR(20) NULL",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
};

export async function ensureSubmissionsTable() {
  if (submissionsTableReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INT AUTO_INCREMENT PRIMARY KEY
    )
  `);

  const [existingCols] = await db.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions'`
  );
  const have = new Set(existingCols.map((c) => c.COLUMN_NAME));

  for (const [col, def] of Object.entries(REQUIRED_SUBMISSION_COLUMNS)) {
    if (!have.has(col)) {
      await db.query(`ALTER TABLE submissions ADD COLUMN ${col} ${def}`);
    }
  }

  submissionsTableReady = true;
}

async function logSubmission(userId, levelId, language, status) {
  try {
    await ensureSubmissionsTable();
    await db.query(
      "INSERT INTO submissions (user_id, level_id, language, status) VALUES (?, ?, ?, ?)",
      [userId, levelId, language, status]
    );
  } catch (err) {
    // Never fail the run/submit response just because logging failed.
    console.error("logSubmission error:", err);
  }
}

/*==================Level Controller Functions==================*/

export async function getLevels(req, res) {
  try {
    const { userId } = req.params;

    // user progress
    const [[progress]] = await db.query(
      "SELECT current_level FROM user_progress WHERE user_id=?",
      [userId]
    );
    const currentLevel = progress ? progress.current_level : 1;

    // all levels
    const [levels] = await db.query(
      "SELECT level_no, title FROM levels ORDER BY level_no"
    );
    res.json({
      currentLevel,
      levels
    });
  } catch (err) {
    console.error("getLevels error:", err);
    res.status(500).json({ error: "Failed to fetch levels" });
  }
}

/* ================= RUN CODE ================= */
export async function runCode(req, res) {
  try {
    const { code, language, input } = req.body;

    const config = LANG_MAP[language];
    if (!config) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const submission = {
      source_code: code,
      language_id: config.judge0Id,
      stdin: input || "",
    };

    const judge = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      submission,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const output = [
      judge.data.stdout,
      judge.data.stderr,
      judge.data.compile_output,
      judge.data.message,
    ]
      .filter(Boolean)
      .join("\n");

    res.json({ output: output.trim() });
  } catch (err) {
    console.error("runCode error:", err);
    res.status(500).json({ error: "Code execution failed" });
  }
}

/* ================= GET CURRENT LEVEL ================= */
export async function getLevel(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const [users] = await db.query(
      "SELECT user_id FROM users WHERE user_id=?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [rows] = await db.query(
      "SELECT current_level FROM user_progress WHERE user_id=?",
      [userId]
    );

    let currentLevel = 1;

    if (rows.length === 0) {
      await db.query(
        "INSERT INTO user_progress (user_id, current_level) VALUES (?,1)",
        [userId]
      );
    } else {
      currentLevel = rows[0].current_level;
    }

    // FIX: honor the ?level= the frontend sends when browsing an earlier
    // unlocked level, instead of always returning the frontier level.
    // Still block any level beyond what the user has actually unlocked.
    const requestedLevel = Number(req.query.level) || currentLevel;

    if (requestedLevel > currentLevel) {
      return res.status(403).json({ error: "Level locked" });
    }

    const [levels] = await db.query(
      "SELECT id, level_no, title, description, youtube_link FROM levels WHERE level_no=?",
      [requestedLevel]
    );

    const level = levels[0];
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    const [sampleTests] = await db.query(
      "SELECT input_data, expected_output FROM test_cases WHERE level_id=? LIMIT 1",
      [level.id]
    );

    res.json({
      level: {
        level_no: level.level_no,
        title: level.title,
        description: level.description,
        youtube_link: level.youtube_link,
      },
      sampleTest: sampleTests[0] || null,
    });
  } catch (err) {
    console.error("getLevel error:", err);
    res.status(500).json({ error: "Failed to fetch level" });
  }
}

/* ================= SUBMIT CODE ================= */
export async function submitCode(req, res) {
  try {
    const { userId, code, language, level } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const [users] = await db.query(
      "SELECT user_id FROM users WHERE user_id=?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const config = LANG_MAP[language];
    if (!config) {
      return res.json({ verdict: "Unsupported language ❌" });
    }

    const [[progress]] = await db.query(
      "SELECT current_level FROM user_progress WHERE user_id=?",
      [userId]
    );

    let currentLevel = 1;
    if (progress && progress.current_level) {
      currentLevel = progress.current_level;
    } else {
      await db.query(
        "INSERT IGNORE INTO user_progress (user_id, current_level) VALUES (?, 1)",
        [userId]
      );
    }

    // FIX: honor the level the frontend was actually viewing/submitting,
    // instead of silently always testing current_level. A user may still
    // only submit for a level they have already unlocked.
    let levelNo = Number(level) || currentLevel;
    if (levelNo > currentLevel) {
      return res.status(403).json({ verdict: "Level locked" });
    }

    const [[levelRow]] = await db.query(
      "SELECT id FROM levels WHERE level_no = ? LIMIT 1",
      [levelNo]
    );

    if (!levelRow) {
      return res.status(400).json({ verdict: "No level found for current progress" });
    }

    const [tests] = await db.query(
      "SELECT id, input_data, expected_output FROM test_cases WHERE level_id=?",
      [levelRow.id]
    );

    if (!tests || tests.length === 0) {
      return res.status(400).json({ verdict: "No test cases found for this level" });
    }

    const normalize = (s) => (typeof s === "string" ? s.replace(/\r/g, "").trim() : "");

    const formattedTests = tests.map((test) => ({
      id: test.id,
      input: test.input_data,
      expected_output: normalize(test.expected_output),
    }));

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];

      const response = await axios.post(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: config.judge0Id,
          stdin: test.input_data,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const userOutput = [
        response.data.stdout,
        response.data.stderr,
        response.data.compile_output,
        response.data.message,
      ]
        .filter(Boolean)
        .join("\n")
        .trim(); 

      if (normalize(userOutput) !== normalize(test.expected_output)) {
        // FIX: log the submission so the admin Submissions/Recent-submissions
        // pages (which query a `submissions` table) have real data to show.
        await logSubmission(userId, levelRow.id, language, "Wrong Answer");

        return res.json({
          verdict: "❌ Wrong Answer",
          failed_test: i + 1,
          input: test.input_data,
          expected_output: normalize(test.expected_output),
          actual_output: normalize(userOutput),
          tests: formattedTests,
          current_level: levelNo,
        });
      }
    }

    // FIX: only advance progress when the level just solved is the user's
    // actual frontier level. Re-submitting an already-passed earlier level
    // (now that /submit accepts a level param) must not skip levels forward.
    if (levelNo === currentLevel) {
      await db.query(
        "UPDATE user_progress SET current_level = current_level + 1 WHERE user_id=?",
        [userId]
      );
    }

    await logSubmission(userId, levelRow.id, language, "Accepted");

    res.json({
      verdict: "✅ Accepted",
      passed_tests: tests.length,
      next_level: levelNo === currentLevel ? levelNo + 1 : currentLevel,
      tests: formattedTests,
      current_level: levelNo,
    });
  } catch (err) {
    console.error("submitCode error:", err);
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ error: "Submission failed", details: err.message });
    }
    res.status(500).json({ error: "Submission failed" });
  }
}
