const jwt = require('jsonwebtoken');
const SECRET_KEY = 'some_key';

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
  
    if (!token) {
      return res.status(401).json('No token provided');
    }
  
    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err) {
        return res.status(500).json('Failed to authenticate token');
      }
  
      req.user = data; // Attach decoded token data to request object
      next(); // Proceed to the next middleware or route handler
    });
  };
  
  module.exports = verifyToken;