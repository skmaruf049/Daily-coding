import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
/* ============ SIGNUP ============ */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // email check
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email=?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert into registration
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    // insert into user_progress (SAFE)
    await db.query(
      "INSERT IGNORE INTO user_progress (user_id, current_level) VALUES (?, 1)",
      [userId]
    );

    res.status(201).json({
      message: "Registration successful",
      userId
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// /* ============ LOGIN ============ */
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const [users] = await db.query(
//     "SELECT user_id, name, password FROM users WHERE email=?",
//     [email]
//   );

//   if (users.length === 0) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   const user = users[0];

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   // ✅ IMPORTANT RESPONSE
//   res.json({
//     message: "Login successful",
//     userId: user.user_id,
//     name: user.name       // 🔥 THIS LINE FIXES EVERYTHING
//   });
// };



/* ============ LOGIN (USER + ADMIN) ============ */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT user_id, name, password, role FROM users WHERE email=?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    userId: user.user_id,
    name: user.name,
    role: user.role,   // 🔥 MOST IMPORTANT
  });
};
