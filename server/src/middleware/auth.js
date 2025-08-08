const jwt = require('jsonwebtoken');
const User = require('../models/users.model'); // Add User model import

const authMiddleware = async (req, res, next) => {
    try {
      console.log("Auth middleware triggered");
      const authHeader = req.headers.authorization;
      console.log("hello")
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token not provided'
        });
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.SECRET);

      console.log(decoded)
      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || user.accessToken !== token) {
        return res.status(401).json({
          success: false,
          message: 'Invalid access token'
        });
      }

      console.log(user)

      // Add user info to request
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role
      };
      console.log("User authenticated:", req.user);
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Access token expired'
        });
      }
      
      console.error('Authentication error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid access token'
      });
    }
  }
module.exports = {
  authMiddleware
};
