const express = require("express");
const Post = require("../models/Post");
const { requireAuth, requireRole } = require("../middleware/authJwt");
const { safeBlobName, createUploadSas } = require("../services/blob");

const router = express.Router();

// All creator routes require auth
router.use(requireAuth);

/**
 * POST /api/creator/uploads/init
 */
router.post("/uploads/init", requireRole("creator"), async (req, res) => {
  const { fileName, contentType } = req.body || {};
  if (!fileName) return res.status(400).json({ error: "fileName is required" });

  const blobName = safeBlobName(req.user.id, fileName);
  const sas = createUploadSas(blobName, contentType);

  res.json(sas);
});

/**
 * POST /api/creator/posts
 */
router.post("/posts", requireRole("creator"), async (req, res) => {
  const {
    mediaType,
    mediaUrl,
    title,
    caption = "",
    location = "",
    peoplePresent = [],
    tags = [],
    thumbnailUrl = "",
  } = req.body || {};

  if (!["image", "video"].includes(mediaType))
    return res.status(400).json({ error: "mediaType must be image or video" });

  if (!mediaUrl || typeof mediaUrl !== "string")
    return res.status(400).json({ error: "mediaUrl is required" });

  if (!title || typeof title !== "string")
    return res.status(400).json({ error: "title is required" });

  const post = await Post.create({
    creatorId: req.user.id,
    mediaType,
    mediaUrl,
    thumbnailUrl,
    title,
    caption,
    location,
    peoplePresent,
    tags,
  });

  res.status(201).json(post);
});

module.exports = router;
