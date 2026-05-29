const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/authJwt");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    {
      id: String(user._id),
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

router.post("/signup", async (req, res) => {
  const { displayName, email, password } = req.body || {};

  if (!displayName?.trim())
    return res.status(400).json({ error: "displayName is required" });
  if (!email?.trim())
    return res.status(400).json({ error: "email is required" });
  if (!password || password.length < 6)
    return res.status(400).json({ error: "password must be at least 6 chars" });

  const exists = await User.findOne({
    email: email.toLowerCase().trim(),
  }).lean();
  if (exists)
    return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);

  // Public signup creates consumer only (per spec)
  const user = await User.create({
    displayName: displayName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role: "consumer",
  });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: {
      id: String(user._id),
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email?.trim())
    return res.status(400).json({ error: "email is required" });
  if (!password) return res.status(400).json({ error: "password is required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: String(user._id),
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    },
  });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
