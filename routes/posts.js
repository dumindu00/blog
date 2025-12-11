const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

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

// POST create new post
router.post('/', async (req, res) => {
  try {
    const { pageName, title, description, image, link } = req.body;
    const post = new Post({ pageName, title, description, image, link });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Bad request', details: err.message });
  }
});

// PUT update existing post by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
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
