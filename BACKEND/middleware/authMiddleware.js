// // Middleware to extract logged-in user's ID
// const authMiddleware = (req, res, next) => {
//     // Assuming the `userId` is stored in the JWT token or session
//     const userId = req.user ? req.user._id : null; // For JWT auth
//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     req.userId = userId; // Attach userId to the request
//     next();
//   };
  

//new

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user data (id and role) to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
