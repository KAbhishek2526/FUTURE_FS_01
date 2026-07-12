const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in the HTTP Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split the space between 'Bearer' and the token string
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the signature using your server environment secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database and pass it forward (excluding the password hash)
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. User record not found.',
        });
      }
      return next();
    } catch (error) {
      console.error('❌ Token Verification Failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Session token has expired or is invalid.',
      });
    }
  }

  // Fallback for custom header structures
  const fallbackHeader = req.header('Authorization');
  if (!token && fallbackHeader) {
    token = fallbackHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. User record not found.',
        });
      }
      return next();
    } catch (error) {
      console.error('❌ Token Verification Failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Session token has expired or is invalid.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No access token provided.',
    });
  }
};

// Role-based Access Middleware Guard for Admin Dashboard security
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'guest'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

const adminMiddleware = authorize('admin');

// Backward compatibility bindings
protect.protect = protect;
protect.authorize = authorize;
protect.authMiddleware = protect;
protect.adminMiddleware = adminMiddleware;

module.exports = protect;
