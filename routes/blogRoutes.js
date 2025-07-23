const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const parser = require('../middlewares/multer');
const { ensureAuth } = require('../middleware/protectRoute');

// Create a new blog
router.post('/create', parser.single('image'), ensureAuth, async (req, res) => {
  const { title, text } = req.body;
  const image = req.file?.path;
  const author = req.user._id;
  const writer = req.user.username;

  if (!title || !image || !text || !author) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newBlog = new Blog({
      title,
      writer, 
      image,
      text,
      author,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: savedBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Blog title must be unique' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({message:"Post Deleted Successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
