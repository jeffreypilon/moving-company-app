const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const environment = require('./config/environment');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const corsOptions = {
  origin: environment.clientUrl,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: environment.nodeEnv
  });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/bookings', require('./routes/bookingRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found'
  });
});

// Error handler middleware (will be implemented later)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal server error',
    ...(environment.nodeEnv === 'development' && { stack: err.stack })
  });
});

const PORT = environment.port;

app.listen(PORT, () => {
  console.log(`Server running in ${environment.nodeEnv} mode on port ${PORT}`);
  console.log(`Client URL: ${environment.clientUrl}`);
});

module.exports = app;
