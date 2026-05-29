const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Rating = require("../models/Rating");
const { createReadSasFromMediaUrl } = require("../services/blob");
const { requireAuth } = require("../middleware/authJwt");

const router = express.Router();

function withViewUrls(p) {
  return {
    ...p,
    mediaViewUrl: p.mediaUrl ? createReadSasFromMediaUrl(p.mediaUrl) : "",
    thumbnailViewUrl: p.thumbnailUrl
      ? createReadSasFromMediaUrl(p.thumbnailUrl)
      : "",
  };
}

/**
 * GET /api/media?page=1&limit=20
 */
router.get("/", async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit || "20", 10), 1),
    50
  );
  const skip = (page - 1) * limit;

  const items = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({ page, limit, items: items.map(withViewUrls) });
});

/**
 * GET /api/media/search?q=...&location=...&people=...
 */
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  const location = (req.query.location || "").trim();
  const people = (req.query.people || "").trim();

  const filter = {};
  const and = [];
  if (q) and.push({ $text: { $search: q } });
  if (location) and.push({ location: new RegExp(location, "i") });
  if (people) and.push({ peoplePresent: new RegExp(people, "i") });
  if (and.length) filter.$and = and;

  const items = await Post.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json({ items: items.map(withViewUrls) });
});

/**
 * GET /api/media/:id
 */
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).lean();
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(withViewUrls(post));
});

/**
 * GET /api/media/:id/comments
 */
router.get("/:id/comments", async (req, res) => {
  const items = await Comment.find({ postId: req.params.id })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  res.json({ items });
});

/**
 * POST /api/media/:id/comments
 */
router.post("/:id/comments", requireAuth, async (req, res) => {
  const postId = req.params.id;
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "text is required" });

  const exists = await Post.exists({ _id: postId });
  if (!exists) return res.status(404).json({ error: "Post not found" });

  const comment = await Comment.create({
    postId,
    userId: req.user.id,
    userDisplayName: req.user.displayName,
    text,
  });

  await Post.updateOne({ _id: postId }, { $inc: { "stats.commentCount": 1 } });
  res.status(201).json(comment);
});

/**
 * GET /api/media/:id/ratings
 * Show who rated + values (for display)
 */
router.get("/:id/ratings", async (req, res) => {
  const items = await Rating.find({ postId: req.params.id })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.json({
    items: items.map((r) => ({
      userId: r.userId,
      userDisplayName: r.userDisplayName,
      value: r.value,
      createdAt: r.createdAt,
    })),
  });
});

/**
 * POST /api/media/:id/rating
 */
router.post("/:id/rating", requireAuth, async (req, res) => {
  const postId = req.params.id;
  const value = Number(req.body.value);

  if (!Number.isFinite(value) || value < 1 || value > 5) {
    return res.status(400).json({ error: "value must be between 1 and 5" });
  }

  const exists = await Post.exists({ _id: postId });
  if (!exists) return res.status(404).json({ error: "Post not found" });

  await Rating.updateOne(
    { postId, userId: req.user.id },
    { $set: { value, userDisplayName: req.user.displayName } },
    { upsert: true }
  );

  const postObjectId = mongoose.Types.ObjectId.createFromHexString(postId);
  const agg = await Rating.aggregate([
    { $match: { postId: postObjectId } },
    { $group: { _id: "$postId", avg: { $avg: "$value" }, count: { $sum: 1 } } },
  ]);

  const avgRating = agg.length ? agg[0].avg : 0;
  const ratingCount = agg.length ? agg[0].count : 0;

  await Post.updateOne(
    { _id: postId },
    { $set: { "stats.avgRating": avgRating, "stats.ratingCount": ratingCount } }
  );

  res.json({ ok: true, avgRating, ratingCount });
});

module.exports = router;
