

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Authorization header me token expect karte hain: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer token" me se token nikalna

  try {
    // JWT token verify karo apni secret key se
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded me user info aayegi, ise request object me attach karo
    req.user = decoded.user;
    next(); // middleware se agla function call karo
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
