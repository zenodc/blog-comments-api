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
      ...req.body, // title, content
      slug,
      excerpt      // inserito qui: così Mongoose lo salva
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

    // Se cambia il contenuto, rigenera l'excerpt
    if (req.body.content) {
      updateData.excerpt = generateExcerpt(req.body.content);
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

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

// GET /posts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('comments');

    if (!post) {
      return res.status(404).json({ error: 'Post non trovato' });
    }

    res.json(post.comments || []);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei commenti' });
  }
});

// POST /posts/:id/comments
router.post('/:id/comments', async (req, res) => {
  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: 'Author e text sono obbligatori' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post non trovato' });
    }

    const newComment = {
      author,
      text
    };

    post.comments.push(newComment);
    post.updatedAt = new Date();

    await post.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel salvataggio del commento' });
  }
});


module.exports = router;
