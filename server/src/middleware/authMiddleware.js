const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          code: 'AUTH_USER_NOT_FOUND',
          error: 'User associated with token no longer exists'
        });
      }
      return next();
    } catch (err) {
      console.error(`[Auth Middleware] JWT Error: ${err.message}`);
      return res.status(401).json({
        success: false,
        code: 'AUTH_EXPIRED',
        error: 'Not authorized, token is invalid or has expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'AUTH_MISSING_TOKEN',
      error: 'Not authorized, access token missing'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: 'FORBIDDEN',
        error: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
