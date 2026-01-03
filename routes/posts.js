const express = require('express');
const Post = require('../models/Post');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function generateExcerpt(text, length = 150) {
  if (!text) return '';

  const plainText = text
    .replace(/<\/?[^>]+(>|$)/g, '') // rimuove HTML
    .trim();

  return plainText.length > length
    ? plainText.substring(0, length) + '…'
    : plainText;
}


// CREAZIONE POST
router.post('/', authenticateToken, async (req, res) => {
  try {
    const slug = slugify(req.body.title);
    const excerpt = generateExcerpt(req.body.content);
    const post = new Post({
      ...req.body,
      slug
    });

    await post.save();
    res.status(201).json(post);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// MODIFICA POST
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };

    // Se cambia il titolo, rigenera lo slug
    if (req.body.title) {
      updateData.slug = slugify(req.body.title);
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (req.body.content) {
      updateData.excerpt = generateExcerpt(req.body.content);
    }


    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    res.json(post);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CANCELLAZIONE POST
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    res.json({ message: 'Post cancellato' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /posts → tutti i post pubblicati
router.get('/', async (req, res) => {
  try {
    const posts = await Post
      .find({ published: true })
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

// GET /posts/:slug → singolo post per slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      published: true
    });

    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    res.json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;
