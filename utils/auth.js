const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET, 
    { expiresIn: '1h' } 
  );
};

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log('Auth done')
    next(); 
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = { generateToken, verifyToken };
