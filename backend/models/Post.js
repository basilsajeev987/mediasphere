const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    creatorId: { type: String, required: true, index: true },

    mediaType: { type: String, enum: ["image", "video"], required: true },
    mediaUrl: { type: String, required: true }, // private blob URL stored (no SAS)
    thumbnailUrl: { type: String, default: "" },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    caption: { type: String, default: "", trim: true, maxlength: 2000 },
    location: { type: String, default: "", trim: true, maxlength: 120 },
    peoplePresent: { type: [String], default: [] },
    tags: { type: [String], default: [] },

    stats: {
      views: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

PostSchema.index({
  title: "text",
  caption: "text",
  location: "text",
  peoplePresent: "text",
});

module.exports = mongoose.model("Post", PostSchema);
