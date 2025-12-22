# MERN Stack Coding Standards

**Version:** 1.0  
**Last Updated:** 2025-12-22  
**Project Type:** Single Page Application (SPA)  
**Project Stack:** MongoDB, Express.js, React (Vite) with Redux, Node.js, Mongoose

---

## Table of Contents

1. [General Principles](#general-principles)
2. [Project Structure](#project-structure)
3. [MongoDB & Mongoose Standards](#mongodb--mongoose-standards)
4. [Express.js & Node.js Backend Standards](#expressjs--nodejs-backend-standards)
5. [React & Vite Frontend Standards](#react--vite-frontend-standards)
6. [API Design Standards](#api-design-standards)
7. [Code Style & Formatting](#code-style--formatting)
8. [Testing & Quality Assurance](#testing--quality-assurance)
9. [Security Best Practices](#security-best-practices)
10. [Documentation Requirements](#documentation-requirements)

---

## 1. General Principles

### Core Values
- **Consistency**: Follow established patterns throughout the codebase
- **Readability**: Write self-documenting code with clear intent
- **Maintainability**: Design for future modifications and scalability
- **Performance**: Optimize for speed without sacrificing code clarity (critical for SPA responsiveness)
- **Security**: Implement security best practices at every layer
- **Component Reusability**: Build modular, reusable components for dynamic UI rendering
- **State Management**: Use Redux for centralized, predictable state management across the SPA

### Code Organization
- Use ES6+ features (arrow functions, async/await, destructuring, etc.)
- Prefer functional programming patterns where appropriate
- Keep functions small and single-purpose (max 50 lines)
- Follow DRY (Don't Repeat Yourself) principles
- Use meaningful variable and function names

### Version Control
- Write clear, descriptive commit messages (present tense)
- Use feature branches and pull requests for all changes
- Keep commits atomic and focused on single changes
- Never commit sensitive data (API keys, passwords, tokens)

---

## 2. Project Structure

### Recommended Directory Structure

```
project-root/
├── client/                     # React frontend (Vite) - Single Page Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/       # Shared components (Button, Input, Modal, etc.)
│   │   │   └── features/     # Feature-specific components (BookingForm, UserProfile, etc.)
│   │   ├── contexts/          # React Context providers (minimal use; prefer Redux)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page-level components (SPA views)
│   │   ├── routes/            # React Router configuration
│   │   ├── services/          # API service calls (axios instances)
│   │   ├── store/             # Redux store configuration
│   │   │   ├── slices/       # Redux Toolkit slices
│   │   │   └── store.js      # Store configuration
│   │   ├── utils/             # Helper functions
│   │   ├── styles/            # Global styles/themes
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── .env.example           # Environment variable template
│   ├── vite.config.js         # Vite configuration
│   └── package.json
│
├── server/                     # Node.js/Express backend
│   ├── config/                # Configuration files
│   │   ├── database.js       # MongoDB connection
│   │   └── environment.js    # Environment variables
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Error handling
│   │   └── validation.js     # Input validation
│   ├── models/                # Mongoose models/schemas
│   ├── routes/                # Express routes (RESTful APIs)
│   ├── services/              # Business logic layer
│   ├── utils/                 # Helper functions
│   ├── validators/            # Request validation schemas
│   ├── server.js              # Express app setup
│   ├── app.js                 # Server entry point
│   ├── . env.example           # Environment variable template
│   └── package.json
│
├── . gitignore
├── README.md
└── coding-standards.md         # This document
```

---

## 3. MongoDB & Mongoose Standards

### Schema Design

#### Naming Conventions
- **Models**: PascalCase, singular nouns (e.g., `User`, `BlogPost`, `OrderItem`)
- **Collections**: Automatically pluralized by Mongoose (e.g., `users`, `blogposts`)
- **Fields**: camelCase (e.g., `firstName`, `emailAddress`, `createdAt`)
- **References**: Use `Id` suffix for ObjectId references (e.g., `userId`, `authorId`)

#### Schema Structure
```javascript
// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // Required fields first
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type:  String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false  // Exclude from queries by default
    },
    
    // Optional fields
    firstName:  {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName:  {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    
    // References to other models
    profileId: {
      type: Schema. Types.ObjectId,
      ref: 'Profile'
    },
    
    // Enums for fixed values
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    
    // Boolean flags
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type:  Boolean,
      default: false
    }
  },
  {
    // Automatic timestamps
    timestamps: true,  // Creates createdAt and updatedAt
    
    // JSON transformation
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1 });

// Instance methods (camelCase)
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`.trim();
};

// Static methods (camelCase)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email. toLowerCase() });
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Only hash password if modified
  if (!this.isModified('password')) return next();
  
  // Hash password logic here
  next();
});

// Virtual properties
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

module.exports = mongoose.model('User', userSchema);
```

### Best Practices

#### Database Connection
```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose. connect(process.env.MONGODB_URI, options);
    
    console.log('MongoDB connected successfully');
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection failed:', error. message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Query Optimization
- Always use `.lean()` for read-only queries to improve performance
- Use `.select()` to limit fields returned from database
- Implement pagination for large datasets
- Use indexes on frequently queried fields
- Avoid N+1 queries with `.populate()`

```javascript
// Good:  Optimized query
const users = await User
  .find({ isActive: true })
  .select('firstName lastName email')
  .limit(20)
  .lean()
  .exec();

// Bad: Unoptimized query
const users = await User. find({ isActive: true });
```

#### Error Handling
- Always use try-catch blocks with async/await
- Provide meaningful error messages
- Use Mongoose validation errors appropriately

```javascript
// services/userService.js
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    if (error.name === 'ValidationError') {
      throw new Error(Object.values(error.errors).map(e => e.message).join(', '));
    }
    throw error;
  }
};
```

---

## 4. Express.js & Node. js Backend Standards

### RESTful API Route Structure

#### Naming Conventions
- **Routes**: kebab-case, plural nouns (e.g., `/api/users`, `/api/blog-posts`)
- **Controllers**: PascalCase with Controller suffix (e.g., `UserController`)
- **Controller methods**: camelCase verbs (e.g., `getUsers`, `createUser`, `updateUser`)
- **Services**: PascalCase with Service suffix (e.g., `UserService`)
- **Middleware**: camelCase (e.g., `authenticate`, `validateUser`)

#### Route Organization
```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateUser } = require('../validators/userValidator');

// RESTful route mapping
// GET /api/users - Get all users (with pagination)
router.get('/', authenticate, UserController.getAllUsers);

// GET /api/users/:id - Get single user by ID
router.get('/:id', authenticate, UserController. getUserById);

// POST /api/users - Create new user
router. post('/', validateUser, UserController.createUser);

// PUT /api/users/: id - Update entire user resource
router.put('/:id', authenticate, validateUser, UserController.updateUser);

// PATCH /api/users/:id - Partial update of user
router.patch('/:id', authenticate, UserController.patchUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', authenticate, authorize('admin'), UserController.deleteUser);

// Nested resource routes
// POST /api/users/:id/avatar - Upload user avatar
router.post('/:id/avatar', authenticate, UserController.uploadAvatar);

module.exports = router;
```

#### Controller Pattern
```javascript
// controllers/UserController.js
const UserService = require('../services/UserService');
const asyncHandler = require('../middleware/asyncHandler');
const { ApiResponse } = require('../utils/apiResponse');

class UserController {
  /**
   * @route   GET /api/users
   * @desc    Get all users with pagination
   * @access  Private
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      order
    };
    
    const result = await UserService.getAllUsers(options);
    
    res.status(200).json(
      new ApiResponse(200, result, 'Users retrieved successfully')
    );
  });

  /**
   * @route   GET /api/users/:id
   * @desc    Get user by ID
   * @access  Private
   */
  getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, 'User not found')
      );
    }
    
    res.status(200).json(
      new ApiResponse(200, user, 'User retrieved successfully')
    );
  });

  /**
   * @route   POST /api/users
   * @desc    Create new user
   * @access  Public
   */
  createUser = asyncHandler(async (req, res) => {
    const user = await UserService.createUser(req.body);
    
    res.status(201).json(
      new ApiResponse(201, user, 'User created successfully')
    );
  });

  /**
   * @route   PUT /api/users/:id
   * @desc    Update user
   * @access  Private
   */
  updateUser = asyncHandler(async (req, res) => {
    const user = await UserService.updateUser(req.params. id, req.body);
    
    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, 'User not found')
      );
    }
    
    res.status(200).json(
      new ApiResponse(200, user, 'User updated successfully')
    );
  });

  /**
   * @route   DELETE /api/users/:id
   * @desc    Delete user
   * @access  Private/Admin
   */
  deleteUser = asyncHandler(async (req, res) => {
    await UserService.deleteUser(req. params.id);
    
    res.status(200).json(
      new ApiResponse(200, null, 'User deleted successfully')
    );
  });
}

module.exports = new UserController();
```

#### Service Layer Pattern
```javascript
// services/UserService.js
const User = require('../models/User');

class UserService {
  async getAllUsers(options) {
    const { page, limit, sortBy, order } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    
    const [users, total] = await Promise.all([
      User.find({ isActive: true })
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({ isActive: true })
    ]);
    
    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    };
  }

  async getUserById(userId) {
    return await User.findById(userId).select('-password').lean();
  }

  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user. toJSON();
  }

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();
```

### Middleware Standards

#### Error Handling Middleware
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    .. .(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

#### Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

### Server Configuration

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:  100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express. json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env. NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
```

---

## 5. React & Vite Frontend Standards

### Single Page Application (SPA) Architecture

This project is built as a **Single Page Application** using React with the following key principles:

- **No Full Page Reloads**: All navigation and UI updates happen dynamically within a single HTML page
- **Client-Side Routing**: Use React Router for seamless navigation without server requests
- **Component-Based UI**: Build modular, reusable components that can be dynamically mounted and unmounted
- **Redux State Management**: Centralize application state in Redux store for predictable state updates
- **Fast Load Times**: Optimize for initial load and lazy-load components as needed
- **Responsive Design**: All components must adapt to different screen sizes (mobile, tablet, desktop)

### Component Structure

#### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`, `BlogPostCard`)
- **Files**: PascalCase matching component name (e.g., `UserProfile.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`, `useFetch`)
- **Redux Actions**: camelCase with descriptive names (e.g., `fetchUsers`, `updateBooking`)
- **Redux Reducers**: camelCase slice names (e.g., `userSlice`, `bookingSlice`)
- **Utilities**: camelCase (e.g., `formatDate`, `validateEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_FILE_SIZE`)

#### Component Organization
```jsx
// components/features/UserProfile/UserProfile.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../../common/Avatar';
import { Button } from '../../common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import './UserProfile.css';

/**
 * UserProfile component displays user information and allows editing
 * @param {Object} props - Component props
 * @param {string} props.userId - User ID to display
 * @param {boolean} props.editable - Whether profile can be edited
 * @param {Function} props.onUpdate - Callback when profile is updated
 */
const UserProfile = ({ userId, editable = false, onUpdate }) => {
  // State declarations (grouped logically)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Custom hooks
  const { currentUser } = useAuth();
  
  // Effects (with clear dependencies)
  useEffect(() => {
    fetchUser();
  }, [userId]);
  
  // Event handlers (use handle prefix)
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSave = async (updatedData) => {
    try {
      setLoading(true);
      const updated = await userService.updateUser(userId, updatedData);
      setUser(updated);
      setIsEditing(false);
      onUpdate?.(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions (inside component for closures, or move to utils if reusable)
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(userId);
      setUser(data);
    } catch (err) {
      setError(err. message);
    } finally {
      setLoading(false);
    }
  };
  
  // Early returns for loading/error states
  if (loading) {
    return <div className="user-profile-loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="user-profile-error">Error: {error}</div>;
  }
  
  if (!user) {
    return <div className="user-profile-empty">User not found</div>;
  }
  
  // Main render
  return (
    <div className="user-profile">
      <div className="user-profile__header">
        <Avatar src={user.avatar} alt={user.fullName} size="large" />
        <h2 className="user-profile__name">{user.fullName}</h2>
        <p className="user-profile__email">{user.email}</p>
      </div>
      
      {editable && currentUser?.id === userId && (
        <div className="user-profile__actions">
          <Button onClick={handleEditToggle} variant="primary">
            {isEditing ?  'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      )}
      
      {isEditing ?  (
        <UserProfileForm user={user} onSave={handleSave} />
      ) : (
        <UserProfileView user={user} />
      )}
    </div>
  );
};

// PropTypes validation
UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  onUpdate: PropTypes. func
};

export default UserProfile;
```

#### Custom Hooks Pattern
```javascript
// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const user = await authService.verifyToken(token);
        setCurrentUser(user);
      }
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err. message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage. removeItem('authToken');
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### React Router Configuration

```jsx
// routes/AppRoutes.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'users/: userId',
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
```

```jsx
// routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div>Loading... </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

### API Service Layer

```javascript
// services/apiClient.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL:  API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response. data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
```

```javascript
// services/userService.js
import apiClient from './apiClient';

class UserService {
  async getAllUsers(params = {}) {
    return await apiClient.get('/users', { params });
  }
  
  async getUserById(userId) {
    return await apiClient. get(`/users/${userId}`);
  }
  
  async createUser(userData) {
    return await apiClient.post('/users', userData);
  }
  
  async updateUser(userId, userData) {
    return await apiClient.put(`/users/${userId}`, userData);
  }
  
  async deleteUser(userId) {
    return await apiClient.delete(`/users/${userId}`);
  }
}

export const userService = new UserService();
```

### State Management Best Practices

This application uses **Redux Toolkit** for centralized state management in the SPA:

#### State Management Strategy
- **Redux Store**: Use Redux for global application state (user authentication, bookings, service areas, etc.)
- **Local Component State**: Use `useState` for UI-specific state (form inputs, modals, loading states)
- **Redux Slices**: Organize state by feature (e.g., `authSlice`, `bookingSlice`, `userSlice`)
- **Async Operations**: Use Redux Toolkit's `createAsyncThunk` for API calls
- **Selectors**: Use `createSelector` from Reselect for memoized state derivation
- **Context API**: Use sparingly for theme or localization (prefer Redux for business logic)

#### Redux Store Structure Example
```javascript
// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    users: userReducer,
  },
});
```

#### Redux Slice Example
```javascript
// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
```

#### Using Redux in Components
```jsx
// components/UserList.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/slices/userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {list.map((user) => (
        <div key={user._id}>{user.firstName} {user.lastName}</div>
      ))}
    </div>
  );
};
```

#### Best Practices
- **Avoid prop drilling**: Use Redux connect or hooks to access state
- **Keep Redux state normalized**: Avoid nested structures; use IDs for relationships
- **Use Redux DevTools**: Enable for debugging state changes
- **Immutable Updates**: Redux Toolkit uses Immer internally for safe mutations

```jsx
// Example: Using composition to avoid prop drilling
const UserDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  return (
    <div className="dashboard">
      <UserList onSelectUser={setSelectedUser} />
      {selectedUser && (
        <UserDetails user={selectedUser} />
      )}
    </div>
  );
};
```

---

## 6. API Design Standards

### RESTful Endpoint Patterns

| HTTP Method | Endpoint Pattern | Description | Status Code |
|-------------|-----------------|-------------|-------------|
| GET | `/api/resources` | Get all resources (with pagination) | 200 OK |
| GET | `/api/resources/:id` | Get single resource by ID | 200 OK / 404 Not Found |
| POST | `/api/resources` | Create new resource | 201 Created |
| PUT | `/api/resources/:id` | Update entire resource | 200 OK / 404 Not Found |
| PATCH | `/api/resources/:id` | Partial update of resource | 200 OK / 404 Not Found |
| DELETE | `/api/resources/:id` | Delete resource | 200 OK / 404 Not Found |

### Nested Resource Routes
```
GET    /api/users/: userId/posts           # Get all posts by user
GET    /api/users/:userId/posts/:postId   # Get specific post by user
POST   /api/users/:userId/posts           # Create post for user
PUT    /api/users/:userId/posts/:postId   # Update user's post
DELETE /api/users/:userId/posts/:postId   # Delete user's post
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data":  {
    "users": [... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10
    }
  }
}
```

#### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": [
    "Email is required",
    "Password must be at least 8 characters"
  ]
}
```

### Query Parameters for Filtering, Sorting, and Pagination

```
GET /api/users?page=2&limit=20&sortBy=createdAt&order=desc&role=admin&isActive=true
```

---

## 7. Code Style & Formatting

### JavaScript/JSX Standards

- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Semicolons**: Use semicolons
- **Line Length**: Max 100 characters
- **Trailing Commas**: Use in multi-line objects and arrays
- **Arrow Functions**:  Prefer arrow functions for callbacks
- **Template Literals**: Use for string interpolation

### ESLint Configuration

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules":  {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": "warn",
    "no-unused-vars": "warn",
    "react/prop-types": "warn",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

---

## 8. Testing & Quality Assurance

### Backend Testing (Jest + Supertest)

```javascript
// __tests__/controllers/userController.test.js
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const { generateToken } = require('../../utils/jwt');

describe('User Controller', () => {
  let authToken;
  
  beforeAll(async () => {
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = generateToken(user._id);
  });
  
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body. data.users)).toBe(true);
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'newuser@example. com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(newUser.email);
    });
    
    it('should return validation error for invalid email', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
});
```

### Frontend Testing (Vitest + React Testing Library)

```jsx
// __tests__/components/UserProfile.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from '../components/UserProfile';
import { userService } from '../services/userService';

vi.mock('../services/userService');

describe('UserProfile', () => {
  const mockUser = {
    id:  '123',
    fullName: 'John Doe',
    email: 'john@example.com'
  };
  
  it('should render user information', async () => {
    userService.getUserById.mockResolvedValue(mockUser);
    
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });
  
  it('should display error message on fetch failure', async () => {
    userService.getUserById.mockRejectedValue(new Error('Failed to fetch'));
    
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});
```

---

## 9. Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Use `.env.example` files to document required variables
- Different `.env` files for different environments

```env
# .env.example
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### Authentication & Authorization
- Use bcrypt for password hashing (minimum 10 rounds)
- Implement JWT with expiration
- Store tokens securely (httpOnly cookies preferred over localStorage)
- Implement refresh token mechanism
- Validate user permissions on every protected route

### Input Validation
- Validate all user inputs on both client and server
- Use libraries like Joi or express-validator
- Sanitize inputs to prevent NoSQL injection
- Implement rate limiting to prevent brute force attacks

### CORS Configuration
```javascript
// Specific CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Security Headers (Helmet. js)
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
```

---

## 10. Documentation Requirements

### Code Comments
- Use JSDoc for functions and classes
- Comment complex logic and business rules
- Avoid obvious comments (code should be self-documenting)

```javascript
/**
 * Calculates the total price including tax and discount
 * @param {number} basePrice - The base price before calculations
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Final price after tax and discount
 */
const calculateFinalPrice = (basePrice, taxRate, discountPercent) => {
  const discountAmount = basePrice * (discountPercent / 100);
  const priceAfterDiscount = basePrice - discountAmount;
  return priceAfterDiscount * (1 + taxRate);
};
```

### README. md Requirements
Every repository should include:
- Project description and purpose
- Technology stack
- Prerequisites and dependencies
- Installation instructions
- Environment variable setup
- Running instructions (development and production)
- Testing instructions
- API documentation or link to API docs
- Contributing guidelines
- License information

### API Documentation
- Use tools like Swagger/OpenAPI or Postman collections
- Document all endpoints with request/response examples
- Include authentication requirements
- Document error responses

---

## Enforcement and Review

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Proper error handling implemented
- [ ] Input validation present
- [ ] No sensitive data exposed
- [ ] Comments and documentation added where necessary
- [ ] Tests written and passing
- [ ] No console. logs in production code
- [ ] Follows DRY principles
- [ ] Performance considerations addressed
- [ ] Security best practices followed

### Git Workflow
1. Create feature branch from `develop`
2. Make changes following these standards
3. Write/update tests
4. Commit with clear messages
5. Push and create pull request
6. Request code review
7. Address feedback
8. Merge after approval

---

**Document Version History:**
- v1.0 (2025-12-22): Initial release

**Review Schedule:** Quarterly or as needed based on project evolution
