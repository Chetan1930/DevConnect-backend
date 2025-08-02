const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middlewares/protectRoute");
const Like = require("../models/likes");
const Comment = require("../models/comment");
const Blog = require("../models/blog"); // Make sure you have this model

// ✅ Like or Unlike a blog post — returns current like status & count

router.post("/:blogId/like", ensureAuth, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  try {
    const existing = await Like.findOne({ user: userId, blog: blogId });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
    } else {
      await Like.create({ user: userId, blog: blogId });
    }

    const totalLikes = await Like.countDocuments({ blog: blogId });
    const liked = !existing;

    return res.status(200).json({ liked, count: totalLikes });
  } catch (err) {
    return res.status(500).json({ error: "Failed to toggle like" });
  }
});


// ✅ Post a new comment to a blog
router.post("/:id/comment", ensureAuth, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment cannot be empty" });
  }

  try {
    const comment = await Comment.create({
      blog: blogId,
      user: userId,
      text,
    });

    const populated = await comment.populate("user", "username avatar");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: "Server error during comment" });
  }
});

// Get all liked of a  blog post 

router.get("/:blogId/like", ensureAuth, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  try {
    const likeCount = await Like.countDocuments({ blog: blogId });
    const likedByUser = await Like.exists({ blog: blogId, user: userId });

    return res.status(200).json({ likeCount, likedByUser: !!likedByUser });
  } catch (err) {
    console.error("Fetch Like Info Error:", err);
    return res.status(500).json({ error: "Failed to fetch like info" });
  }
});

// ✅ Get all comments of a blog post
router.get("/:id/comments", ensureAuth, async (req, res) => {
  const blogId = req.params.id;

  try {
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");

    res.json(comments);
  } catch (err) {
    console.error("Fetch Comments Error:", err);
    res.status(500).json({ message: "Server error fetching comments" });
  }
});

router.delete('/:id/comments',ensureAuth, async (req, res) => {
  const commentId = req.params.id;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    // console.log("bs dekhna h ye kya m yha tk aa pa rha hu ");
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Deleting comment error:", err);
    res.status(500).json({ message: "Server error deleting comment" });
  }
});



module.exports = router;
