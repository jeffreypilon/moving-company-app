const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware to authenticate user with JWT token
 * Expects token in Authorization header: Bearer <token>
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'No token provided. Please login to access this resource.'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Invalid token format'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'User no longer exists'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'User account is inactive'
      });
    }

    // Attach user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      userType: decoded.userType
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

/**
 * Middleware to authorize user based on role
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: `User role '${req.user.userType}' is not authorized to access this resource`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
