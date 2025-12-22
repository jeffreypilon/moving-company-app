require('dotenv').config();

/**
 * Environment configuration
 * Validates and exports environment variables
 */
const environment = {
  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Server configuration
  port: process.env.PORT || 5000,
  
  // Database configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/moving-company',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_change_this_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // CORS configuration
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Bcrypt configuration
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  
  // File upload configuration
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

const validateEnvironment = () => {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missingVars.join(', ')}`
    );
    console.warn('Using default values. Please set these in production!');
  }
};

validateEnvironment();

module.exports = environment;
