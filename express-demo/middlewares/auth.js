module.exports = {
  // Middleware function to authenticate the JWT token in the request
  authenticate: function authenticateToken(req, res, next) {
    // Get the Authorization header with the JWT token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // If the token is not found, return an HTTP 401 error
    console.log("-",token)
    if (!token) return res.status(401).json({ message: "Invalid Token" });
    // Check the token and get the payload
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return res.status(401).json({ message: "Invalid Token" });
      req.user = payload;
      next();
    });
  },
};
