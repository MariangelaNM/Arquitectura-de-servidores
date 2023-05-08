const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
app.use(express.json());

// connect to in-memory database
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// create a new post
app.post('/posts', async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author
    });
    await post.validate();
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get all posts
app.get('/posts', async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// start the server
app.listen(3000, () => console.log('Server started on port 3000'));
