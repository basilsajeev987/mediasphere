const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri) throw new Error("MONGODB_URI is missing in .env");

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log("✅ MongoDB connected");
}

module.exports = { connectDB };
