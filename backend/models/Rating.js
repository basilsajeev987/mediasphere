const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    userDisplayName: { type: String, required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

RatingSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
