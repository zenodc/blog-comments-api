const mongoose = require('mongoose');

// sottoschema per i commenti
const commentSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  {
    _id: false // non ci serve un id per ogni singolo commento
  }
);

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: String,

  // 👇 NUOVO CAMPO
  comments: [commentSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  published: { type: Boolean, default: true }
});

module.exports = mongoose.model('Post', postSchema);
