const router = require('express').Router();


const Like = require("../models/likes");
const Comment = require("../models/comment");
const { ensureAuth } = require('../middleware/protectRoute');


// router.get('/', (req,res)=>{
//   res.json({message:"bhai ye toh properly work kr rha h"});
// })

router.post("/:blogid/like" , async (req, res) => {
    console.log("yha backend se bhi like ka function run kr rh h ");
    const { blogId } = req.params;
    const userId = req.user._id;
    console.log(userId);
    console.log(blogId);
  try {
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
router.post("/:id/comment", async (req, res) => {
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