const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET posts by pageName
router.get('/:pageName', async (req, res) => {
  try {
    const pageName = req.params.pageName;
    const posts = await Post.find({ pageName }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create new post with optional image upload
router.post('/', upload.single('image'), async (req, res) => {
  console.log("=== NEW POST REQUEST ===");
  console.log("req.body:", req.body); // <-- log text fields
  console.log("req.file:", req.file); // <-- log uploaded file
  
  
  try {
    
    const { pageName, title, description, link } = req.body;
    let image = req.body.image || '';

    if (req.file) {
      const streamUpload = (reqFile) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'blog_posts' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(reqFile.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file);
      image = result.secure_url;
    }

    const post = new Post({ pageName, title, description, image, link });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request', details: err.message });
  }
});

// PUT update existing post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    if (req.file) {
      const streamUpload = (reqFile) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'blog_posts' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(reqFile.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file);
      update.image = result.secure_url;
    }

    const post = await Post.findByIdAndUpdate(id, update, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request' });
  }
});

// DELETE post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
