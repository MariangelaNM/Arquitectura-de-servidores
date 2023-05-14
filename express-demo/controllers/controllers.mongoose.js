const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/model.mongoose");
const User = require("../models/model.user.mongoose");
const tools = require("../middlewares/auth.js");
const bcrypt = require("bcrypt");

const router = express();

// connect to in-memory database
mongoose.connect("mongodb://localhost/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create a new post
router.post("/api/posts", tools.authenticate, async (req, res) => {
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
router.get("/api/posts", tools.authenticate, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a single post by ID
router.get("/api/posts/:id", tools.authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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
router.patch("/api/posts/:id", tools.authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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
router.delete("/api/posts/:id", tools.authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      await post.remove();
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      bio,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Credentials invalidad" });
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Credentials invalidad" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// start the server
router.listen(3000, () => console.log("Server started on port 3000"));
