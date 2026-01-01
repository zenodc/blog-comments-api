const express = require('express');
const Post = require('../models/Post');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Creazione post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Modifica post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cancellazione post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trovato' });
    res.json({ message: 'Post cancellato' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
