const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/model.mongoose");

const app = express();
app.use(express.json());

// connect to in-memory database
mongoose.connect("mongodb://0.0.0.0:27017/People", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      author: req.body.author,
    });
    await post.validate();
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a single post by ID
app.get("/api/posts/:_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update a post by ID
app.patch("/api/posts/:_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (post) {
      if (req.body.title) {
        post.title = req.body.title;
      }
      if (req.body.text) {
        post.text = req.body.text;
      }
      if (req.body.author) {
        post.author = req.body.author;
      }
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a post by ID
app.delete("/api/posts/:_id", async (req, res) => {
  try {

    console.log(await Post.findById(req.params._id));
    const post = await Post.findById(req.params._id);
    if (post) {
      await Post.deleteMany({ _id: req.params._id });
      res.sendStatus(204).json({ message: "Well" });;
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// start the server
app.listen(3000, () => console.log("Server started on port 3000"));
