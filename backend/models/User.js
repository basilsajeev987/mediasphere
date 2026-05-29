const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["consumer", "creator", "admin"],
      default: "consumer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
