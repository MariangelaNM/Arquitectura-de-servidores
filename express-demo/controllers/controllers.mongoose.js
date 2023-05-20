const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/model.mongoose");
const User = require("../models/model.user.mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const tools = require("../middlewares/auth.js");
const router = express();
router.use(express.json())
const uuid = require('uuid');
// connect to in-memory database
mongoose.connect("mongodb://0.0.0.0:27017/People", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//create post
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


router.get("/api/posts", tools.authenticate, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a single post by ID

router.get("/api/posts/:_id", tools.authenticate, async (req, res) => {

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
router.patch("/api/posts/:_id", tools.authenticate, async (req, res) => {

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
router.delete("/api/posts/:_id", tools.authenticate, async (req, res) => {

  try {

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



// Rut POST /api/login
router.post('/api/login', async (req, res) => {
  try {
    const password = JSON.stringify({ 'password': req.body.password });
    const email = JSON.stringify({ 'email': req.body.email });


    if (!email || !password) {
      return res.status(400).json({ error: 'I need a email and password' });
    }
    const posts = await User.find();

    const user = posts.find(user => user.email === req.body.email);


    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    await bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      try {
        if (result) {
          console.log('password matches');
          if (!user.active) {
            return res.status(401).json({ error: 'Account Inactive' });
          }
          return true;
        } else {
          return res.status(401).json({ error: 'Credenciales inválidas' });
        }
      } catch { }
    });
    if (user.active === false) {
      return res.status(401).json({ error: 'Account Inactive' });
    }

    const token = jwt.sign({ userId: user._id }, 'secreto', { expiresIn: '1h' });


    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Service error' });
  }
});

//Create the account
router.post("/api/users", async (req, res) => {
  try {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const activationToken = uuid.v4();
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      bio: req.body.bio,
      active: false,
      activationToken: activationToken
    });

    await user.save();
    //return the link to activate de account
    res.status(201).json("http://localhost:3000/api/users/activate/" + activationToken);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//this reques activate de account
router.get('/api/users/activate/:activationToken', async (req, res) => {
  try {
    const activationToken = req.params.activationToken;
    // search user
    const user = await User.findOne({ activationToken });

    if (!user) {
      return res.status(404).json({ error: 'Invalid Token' });
    }
    user.active = true;
    user.activationToken = undefined;
    await user.save();
    res.json({ message: 'Active Account' });
  } catch (error) {
    console.error('Error activation:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// get all users
router.get("/api/user", async (req, res) => {
  try {
    const posts = await User.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// start the server
router.listen(3000, () => console.log("Server started on port 3000"));
