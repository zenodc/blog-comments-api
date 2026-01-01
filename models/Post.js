const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  published: { type: Boolean, default: true }
});

module.exports = mongoose.model('Post', postSchema);
