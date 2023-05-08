const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: [true, 'Title is required.'],
    minlength: [5, 'Title must be at least 5 characters.']
  },
  text: {
    type: String,
    required: [true, 'Text is required.'],
    minlength: [5, 'Text must be at least 5 characters.']
  },
  author: {
    type: String,
    required: [true, 'Author is required.']
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
