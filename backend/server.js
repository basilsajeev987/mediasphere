require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const mediaRoutes = require("./routes/media.routes");
const creatorRoutes = require("./routes/creator.routes");

const app = express();

const allowed = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true);
      if (!allowed.length) return cb(null, true);
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked: " + origin));
    },
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "media-api", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/creator", creatorRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error", details: err.message });
});

const port = process.env.PORT || 8080;

connectDB(process.env.MONGODB_URI)
  .then(() =>
    app.listen(port, () =>
      console.log(`✅ API running on http://localhost:${port}`)
    )
  )
  .catch((e) => {
    console.error("❌ DB connect failed:", e.message);
    process.exit(1);
  });
