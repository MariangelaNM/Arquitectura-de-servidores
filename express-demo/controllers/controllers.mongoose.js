const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/model.mongoose");
const User = require("../models/model.user.mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const tools = require("../middlewares/auth.js");
const router = express();
router.use(express.json())
// connect to in-memory database
mongoose.connect("mongodb://0.0.0.0:27017/People", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Ruta POST /api/login
router.post('/api/login', async (req, res) => {
  try {
    const password = JSON.stringify({ 'password': req.body.password });
    const email = JSON.stringify({ 'email': req.body.email });

    // Validar los datos de entrada
    if (!email || !password) {
      return res.status(400).json({ error: 'Debes proporcionar email y contraseña' });
    }
    const posts = await User.find();
    // Buscar al usuario por su email
    const user = posts.find(user => user.email === req.body.email);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    await bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      if (result) {
        console.log('La contraseña coincide');
        return true;
      } else {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
    });

    // Generar el token JWT de sesión
    const token = jwt.sign({ userId: user._id }, 'secreto', { expiresIn: '1h' });

    // Devolver el token JWT en la respuesta
    return res.json({ token });
  } catch (error) {
    console.error('Error al realizar el inicio de sesión:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
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

router.post("/api/users", async (req, res) => {
  try {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      bio: req.body.bio,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
