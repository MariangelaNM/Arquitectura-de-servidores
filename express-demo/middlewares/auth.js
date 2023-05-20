const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
module.exports = {
  // Middleware function to authenticate the JWT token in the request
  authenticate: function authenticateToken(req, res, next) {
    // Get the Authorization header with the JWT token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }
  
    jwt.verify(token, 'secreto', (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }
  
      req.userId = decodedToken.userId;
      next();
    });
  },
};
