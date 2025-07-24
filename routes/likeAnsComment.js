const router = require('express').Router();
// POST /api/blogs/:id/like
const Like = require("../models/likes");
const Comment = require("../models/comment");
const { ensureAuth } = require('../middleware/protectRoute');

router.post("/like/:blogId", ensureAuth , async (req, res) => {
    console.log("yha backend se bhi like ka function run kr rh h ");
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const existingLike = await Like.findOne({ blog: blogId, user: userId });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ liked: false });
    } else {
      await Like.create({ blog: blogId, user: userId });
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({message1:"toh ye msg yha se ja rha h ", message: "Server error" });
  }
});


// POST /api/blogs/:id/comment
router.post("/:id/comment", ensureAuth, async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Comment cannot be empty" });

    const comment = await Comment.create({
        blog: blogId,
        user: userId,
        text,
    });

    const populated = await comment.populate("user", "username avatar");
    res.status(201).json(populated);
});


module.exports = router;