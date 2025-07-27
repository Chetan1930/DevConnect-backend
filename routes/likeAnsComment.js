const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middlewares/protectRoute");
const Like = require("../models/likes");
const Comment = require("../models/comment");
const Blog = require("../models/blog"); // Make sure you have this model

// ✅ Like or Unlike a blog post — returns current like status & count

router.get('/', (req,res)=>{
  res.send("sb shi chl rha h ");
})
router.post("/:blogid/like", ensureAuth, async (req, res) => {
  const blogId = req.params.blogid;
  const userId = req.user._id;

  try {
    const existingLike = await Like.findOne({ blog: blogId, user: userId });

    let liked;
    if (existingLike) {
      await existingLike.deleteOne(); // Unlike
      liked = false;
    } else {
      await Like.create({ blog: blogId, user: userId }); // Like
      liked = true;
    }

    const likeCount = await Like.countDocuments({ blog: blogId });

    res.json({ liked, likeCount });
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).json({ message: "Server error during like/unlike" });
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

// @route   GET /blogs/:id
// @desc    Get single blog with likeCount and likedByUser
// @access  Private (or Public if you drop ensureAuth)

router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const blogId = req.params.id;

    // Find the blog and populate author
    const blog = await Blog.findById(blogId)
      .populate("author", "name email") // Populate author fields as needed
      .lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Count likes for this blog
    const likeCount = await Like.countDocuments({ blog: blogId });

    // Check if the current user has liked this blog
    const likedByUser = await Like.exists({
      blog: blogId,
      user: req.user._id,
    });
    res.status(200).json({
      ...blog,
      likeCount,
      likedByUser: !!likedByUser, 
    });
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Server error fetching blog" });
  }
});


module.exports = router;
