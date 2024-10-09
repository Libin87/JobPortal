const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Include user ID and role in token
    process.env.JWT_SECRET, // Secret key from .env
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

module.exports = { generateToken };
