import db from "../db.js";

export const sendFeedback = async (req, res) => {
  const { user_id, email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({
      success: false,
      msg: "Email and message required",
    });
  }

  const sql =
    "INSERT INTO feedback (user_id, email, message) VALUES (?, ?, ?)";

  try {
    await db.query(sql, [user_id || null, email, message]);

    return res.status(201).json({
      success: true,
      msg: "✅ Message sent successfully",
    });
  } catch (err) {
    console.error("Contact save failed:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};