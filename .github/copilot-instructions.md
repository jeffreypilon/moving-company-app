# Copilot Instructions for Moving Company MERN Stack Application

**Last Updated:** 2025-12-22  
**Project:** Moving Company Online Booking Application  
**Stack:** MongoDB, Express.js, React (Vite), Node.js, Mongoose

---

## Project Overview

This is a **Single Page Application (SPA)** built with the MERN stack for a moving company. The application uses **React with Redux** for state management and implements a **component-based architecture** to dynamically render the user interface, ensuring fast page loading and responsive user experience.

**Customer Features:**
- Submit moving service inquiries
- Receive automated quotations based on move details (rooms, property type, distance)
- Book moving services online
- View service availability by geographical area

**Admin Features:**
- Define geographical service areas
- View and maintain customer details and bookings
- Manage service offerings and pricing

**Technical Architecture:**
- **Frontend:** React SPA with Redux for centralized state management
- **Component Strategy:** Modular, reusable components for dynamic UI rendering
- **Routing:** Client-side routing with React Router for seamless navigation
- **Performance:** Optimized for fast loading and responsive interactions without full page refreshes

**Important:** Always refer to `coding-standards.md` in the root directory for detailed coding conventions, patterns, and best practices.

---

## Project Structure

The repository follows a monorepo pattern with separate `client/` and `server/` directories:

```
project-root/
├── client/                     # React frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts
│   │   ├── components/
│   │   │   ├── common/       # Reusable components (Button, Input, etc.)
│   │   │   └── features/     # Feature-specific components
│   │   ├── contexts/          # React Context providers (AuthContext, etc.)
│   │   ├── hooks/             # Custom React hooks (useAuth, useFetch)
│   │   ├── pages/             # Page components (HomePage, BookingPage)
│   │   ├── routes/            # React Router configuration
│   │   ├── services/          # API service calls (apiClient.js)
│   │   ├── utils/             # Helper functions
│   │   ├── styles/            # Global styles/themes
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── .env.example           # Environment variable template
│   ├── vite.config.js         # Vite configuration
│   ├── package.json
│   └── index.html
│
├── server/                     # Node.js/Express backend
│   ├── config/
│   │   ├── database.js       # MongoDB connection configuration
│   │   └── environment.js    # Environment variable management
│   ├── controllers/           # Route controllers (handle HTTP requests)
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Centralized error handling
│   │   └── validation.js     # Input validation
│   ├── models/                # Mongoose schemas/models
│   ├── repositories/          # Data access layer (database operations)
│   ├── routes/                # Express routes (RESTful API endpoints)
│   ├── services/              # Business logic layer
│   ├── utils/                 # Helper functions
│   ├── validators/            # Request validation schemas
│   ├── server.js              # Express app setup and configuration
│   ├── app.js                 # Server entry point
│   ├── .env.example           # Environment variable template
│   └── package.json
│
├── .gitignore
├── README.md
└── coding-standards.md         # Comprehensive coding standards (READ THIS)
```

---

## Building and Running the Application

### Prerequisites

**IMPORTANT:** This is a new project. The following instructions represent the expected setup once the application is scaffolded. If directories don't exist, they need to be created following the structure above.

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 9.x or higher (comes with Node.js)
- **MongoDB**: Version 6.x or higher (local or MongoDB Atlas)
- **Git**: For version control

### Initial Setup (First Time Only)

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd moving-company-app
   ```

2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**:
   
   **Backend** (`server/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/moving-company
   JWT_SECRET=your_jwt_secret_change_this_in_production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   Copy from `.env.example` files if they exist.

5. **Start MongoDB** (if running locally):
   ```bash
   mongod --dbpath /path/to/data/directory
   ```

### Development Workflow

**ALWAYS follow this sequence for development:**

1. **Start the backend server first** (from `server/` directory):
   ```bash
   cd server
   npm run dev
   ```
   - Expected output: "Server running in development mode on port 5000" and "MongoDB connected successfully"
   - If MongoDB connection fails, verify MONGODB_URI in `.env`
   - Port 5000 must be available; if in use, change PORT in `.env`

2. **Start the frontend** (from `client/` directory, in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   - Expected output: Vite dev server running on `http://localhost:5173`
   - Port 5173 must be available; Vite will auto-select next available port if needed
   - Browser should open automatically or navigate to displayed URL

### Build Process

**Backend:**
- No build step required for Node.js/Express
- For production: Ensure NODE_ENV=production in environment

**Frontend:**
```bash
cd client
npm run build
```
- Creates optimized production build in `client/dist/`
- Typical build time: 10-30 seconds depending on project size
- If build fails with memory errors, try: `NODE_OPTIONS=--max_old_space_size=4096 npm run build`

### Testing

**Backend Tests** (Jest + Supertest):
```bash
cd server
npm test                    # Run all tests
npm test -- --watch        # Run in watch mode
npm test -- path/to/test   # Run specific test file
npm run test:coverage      # Generate coverage report
```

**Frontend Tests** (Vitest + React Testing Library):
```bash
cd client
npm test                    # Run all tests
npm test -- --watch        # Run in watch mode
npm test -- path/to/test   # Run specific test file
npm run test:ui            # Open Vitest UI (if configured)
npm run test:coverage      # Generate coverage report
```

**IMPORTANT:** Always run tests before committing code changes. Both backend and frontend tests should pass.

### Linting and Code Quality

**Backend:**
```bash
cd server
npm run lint               # Check for linting errors
npm run lint:fix           # Auto-fix linting errors
```

**Frontend:**
```bash
cd client
npm run lint               # Check for linting errors
npm run lint:fix           # Auto-fix linting errors
```

**Format code** (if Prettier is configured):
```bash
npm run format
```

**ALWAYS run linting before committing.** Fix all errors; warnings should be addressed if possible.

---

## Coding Conventions (Summary)

**Full details in `coding-standards.md`** - READ IT before making changes.

### Naming Conventions

- **Models/Schemas**: PascalCase, singular (e.g., `User`, `Booking`, `ServiceArea`)
- **Repositories**: PascalCase with Repository suffix (e.g., `UserRepository`, `BookingRepository`)
- **Services**: PascalCase with Service suffix (e.g., `UserService`, `BookingService`)
- **Controllers**: PascalCase with Controller suffix (e.g., `UserController`, `BookingController`)
- **Components**: PascalCase (e.g., `BookingForm`, `UserProfile`)
- **Files**: Match component/model name (e.g., `BookingForm.jsx`, `User.js`, `UserRepository.js`)
- **API Routes**: kebab-case, plural (e.g., `/api/bookings`, `/api/service-areas`)
- **Functions/Variables**: camelCase (e.g., `getUserById`, `totalPrice`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `API_BASE_URL`)
- **Database Fields**: camelCase (e.g., `firstName`, `createdAt`, `userId`)

### File Organization

**Backend Architecture Layers:**
The backend follows a layered architecture pattern:
1. **Controllers** → Handle HTTP requests/responses
2. **Services** → Contain business logic
3. **Repositories** → Handle data access and database operations
4. **Models** → Define database schemas

**Backend Controllers:**
- Use class-based controllers with PascalCase names ending in "Controller"
- Export instance: `module.exports = new UserController();`
- Use async/await with asyncHandler wrapper for error handling
- Add JSDoc comments for each route handler
- Controllers call Services, never directly access Repositories or Models

**Backend Services:**
- Use class-based services with PascalCase names ending in "Service"
- Contains business logic only (no HTTP request/response handling)
- Export instance: `module.exports = new UserService();`
- Services call Repositories for data access

**Backend Repositories:**
- Use class-based repositories with PascalCase names ending in "Repository"
- Handle all database operations (CRUD, queries, aggregations)
- Export instance: `module.exports = new UserRepository();`
- Repositories interact directly with Models
- Use `.lean()` for read-only queries, `.select()` to limit fields
- Implement pagination, filtering, and sorting logic here

**Backend Models:**
- Define Mongoose schemas with detailed validation
- Use timestamps: true for automatic createdAt/updatedAt
- Add indexes for frequently queried fields
- Use instance methods (camelCase) for document operations
- Use static methods (camelCase) for model operations

**Frontend Components:**
- Use functional components with hooks (no class components)
- PropTypes validation required
- Organize: imports → state → effects → handlers → helpers → early returns → render
- Extract complex logic into custom hooks

**Frontend Services:**
- Use class-based services for API calls
- Export singleton instance
- Use axios interceptors for auth tokens and error handling

### Key Patterns

**API Response Format (ALWAYS use this):**
```javascript
{
  "success": true/false,
  "statusCode": 200/201/400/404/500,
  "message": "Human-readable message",
  "data": { /* response data */ }
}
```

**Error Handling:**
- Backend: Use centralized errorHandler middleware
- Always use try-catch blocks with async/await
- Frontend: Use try-catch in async functions; display user-friendly messages

**Database Queries:**
- Use `.lean()` for read-only queries (better performance)
- Use `.select()` to limit fields returned
- Implement pagination for list endpoints
- Always exclude sensitive fields (e.g., password) with `select: false` in schema or `.select('-password')`

---

## Common Issues and Solutions

### MongoDB Connection Issues

**Problem:** "MongooseServerSelectionError: connect ECONNREFUSED"
**Solution:**
- Verify MongoDB is running: `mongosh` (or `mongo`) to test connection
- Check MONGODB_URI in `server/.env`
- For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/moving-company`
- For MongoDB Atlas: Use connection string from Atlas dashboard

### Port Already in Use

**Problem:** "Error: listen EADDRINUSE: address already in use :::5000"
**Solution:**
```bash
# Find process using the port
lsof -i :5000          # macOS/Linux
netstat -ano | findstr :5000   # Windows

# Kill the process or change PORT in server/.env
```

### Frontend Can't Connect to Backend

**Problem:** Network errors or CORS errors in browser console
**Solution:**
- Verify backend is running on correct port
- Check `VITE_API_BASE_URL` in `client/.env` matches backend URL
- Verify CORS configuration in `server/server.js` includes CLIENT_URL
- Ensure CLIENT_URL in `server/.env` matches frontend URL exactly

### Build Failures

**Frontend build memory issues:**
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Dependency issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Import Path Issues

**Problem:** Module not found errors
**Solution:**
- Use relative paths from current file location
- Frontend: Use `import.meta.env` for environment variables (Vite)
- Backend: Use `process.env` for environment variables
- Ensure file extensions (.js, .jsx) are correct

---

## Environment Variables

### Backend (`server/.env`)

**Required:**
- `NODE_ENV`: "development" or "production"
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `JWT_EXPIRE`: Token expiration (e.g., "7d", "24h")
- `CLIENT_URL`: Frontend URL for CORS (e.g., "http://localhost:5173")

**Optional (add as needed):**
- `BCRYPT_ROUNDS`: Number of salt rounds for bcrypt (default: 10)
- `UPLOAD_DIR`: Directory for file uploads
- `MAX_FILE_SIZE`: Maximum upload file size

### Frontend (`client/.env`)

**Required:**
- `VITE_API_BASE_URL`: Backend API URL (e.g., "http://localhost:5000/api")

**Optional (add as needed):**
- `VITE_APP_TITLE`: Application title
- Any other app-specific configuration

**Note:** Vite only exposes env variables prefixed with `VITE_`. Access with `import.meta.env.VITE_*`.

---

## Git Workflow and CI/CD

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development integration branch
- Feature branches: `feature/descriptive-name`
- Bug fixes: `bugfix/descriptive-name`

### Commit Messages

Use clear, present-tense messages:
- "Add user authentication middleware"
- "Fix booking form validation error"
- "Update service area model schema"

### Before Committing

**ALWAYS complete these steps:**
1. Run linters: `npm run lint` (fix all errors)
2. Run tests: `npm test` (all tests must pass)
3. Test functionality manually if UI changes
4. Verify no sensitive data (API keys, passwords) in code
5. Check `.gitignore` excludes `node_modules`, `.env`, `dist/`

### CI/CD Pipeline

**GitHub Actions workflows** (if configured in `.github/workflows/`):
- Trigger on: push to main/develop, pull requests
- Steps: Install dependencies → Lint → Test → Build
- Both backend and frontend must pass all checks

**If CI fails:**
1. Check workflow logs in GitHub Actions tab
2. Run the exact failing command locally
3. Fix the issue
4. Commit and push the fix
5. Verify CI passes on retry

---

## Security Best Practices

**CRITICAL - ALWAYS Follow These:**

1. **Never commit sensitive data:**
   - API keys, passwords, tokens, secrets
   - Private keys, certificates
   - Real database connection strings
   - Use environment variables and `.env` files (add `.env` to `.gitignore`)

2. **Authentication & Authorization:**
   - Use bcrypt for password hashing (minimum 10 rounds)
   - Implement JWT with expiration
   - Validate user permissions on every protected route
   - Use authentication middleware consistently

3. **Input Validation:**
   - Validate ALL user inputs on both client and server
   - Sanitize inputs to prevent NoSQL injection (use express-mongo-sanitize)
   - Use validation libraries (Joi, express-validator)
   - Never trust client-side validation alone

4. **Dependencies:**
   - Regularly update dependencies: `npm audit` and `npm audit fix`
   - Review security advisories
   - Only install packages from trusted sources

5. **CORS Configuration:**
   - Specify exact origins (avoid wildcards in production)
   - Set `credentials: true` if using cookies
   - Configure in `server/server.js`

6. **Rate Limiting:**
   - Implement on all API endpoints to prevent brute force attacks
   - Use express-rate-limit middleware

---

## API Design

### RESTful Endpoints

Follow standard REST conventions:

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/resources` | Get all (paginated) | 200 |
| GET | `/api/resources/:id` | Get single resource | 200 / 404 |
| POST | `/api/resources` | Create new | 201 |
| PUT | `/api/resources/:id` | Update (full) | 200 / 404 |
| PATCH | `/api/resources/:id` | Update (partial) | 200 / 404 |
| DELETE | `/api/resources/:id` | Delete | 200 / 404 |

### Pagination, Filtering, Sorting

Standard query parameters:
```
GET /api/bookings?page=1&limit=20&sortBy=createdAt&order=desc&status=pending
```

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Field to sort by (default: createdAt)
- `order`: "asc" or "desc" (default: desc)
- Additional filters: Based on model fields

### Nested Routes

For related resources:
```
GET /api/users/:userId/bookings           # Get user's bookings
POST /api/users/:userId/bookings          # Create booking for user
GET /api/service-areas/:areaId/bookings   # Get bookings in area
```

---

## Database Schema Conventions

### Model Structure

```javascript
const schema = new Schema(
  {
    // Required fields first
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    
    // Optional fields
    firstName: { type: String, trim: true },
    
    // References (with Id suffix)
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    
    // Enums for fixed values
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending'
    },
    
    // Booleans (with is/has prefix)
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,  // Auto createdAt/updatedAt
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;  // Remove sensitive fields
        return ret;
      }
    }
  }
);

// Add indexes
schema.index({ email: 1 });
schema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ModelName', schema);
```

### Important Collections (Expected)

- `users`: Customer and admin accounts
- `bookings`: Moving service bookings
- `serviceareas`: Geographical areas served
- `quotes`: Moving quotes generated
- `services`: Service offerings

### Repository Layer Pattern Example

The repository layer encapsulates all data access logic:

```javascript
// repositories/UserRepository.js
const User = require('../models/User');

class UserRepository {
  /**
   * Find all users with pagination and filtering
   */
  async findAll(options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', filters = {} } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'asc' ? 1 : -1 };
    
    const [users, total] = await Promise.all([
      User.find(filters)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters)
    ]);
    
    return { users, total, page, limit };
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    return await User.findById(userId).select('-password').lean();
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() }).lean();
  }

  /**
   * Create new user
   */
  async create(userData) {
    const user = new User(userData);
    await user.save();
    return user.toJSON();
  }

  /**
   * Update user by ID
   */
  async update(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').lean();
  }

  /**
   * Delete user by ID
   */
  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email) {
    return await User.exists({ email: email.toLowerCase() });
  }
}

module.exports = new UserRepository();
```

**Services use Repositories:**
```javascript
// services/UserService.js
const UserRepository = require('../repositories/UserRepository');

class UserService {
  async getAllUsers(options) {
    // Business logic here
    const filters = { isActive: true };
    if (options.role) filters.role = options.role;
    
    const result = await UserRepository.findAll({ ...options, filters });
    
    return {
      users: result.users,
      pagination: {
        currentPage: result.page,
        totalPages: Math.ceil(result.total / result.limit),
        totalItems: result.total,
        itemsPerPage: result.limit
      }
    };
  }

  async getUserById(userId) {
    return await UserRepository.findById(userId);
  }

  async createUser(userData) {
    // Business logic: validate, check duplicates, etc.
    const exists = await UserRepository.existsByEmail(userData.email);
    if (exists) {
      throw new Error('Email already exists');
    }
    
    return await UserRepository.create(userData);
  }

  async updateUser(userId, updateData) {
    // Business logic here
    return await UserRepository.update(userId, updateData);
  }

  async deleteUser(userId) {
    const user = await UserRepository.delete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UserService();
```

**Benefits of Repository Layer:**
- Separation of concerns: data access logic isolated from business logic
- Easier testing: mock repositories instead of database
- Reusability: same repository methods used across multiple services
- Maintainability: database query changes only affect repository layer

---

## Performance Optimization

### Backend

- Use database indexes on frequently queried fields
- Use `.lean()` for read-only queries
- Implement caching for frequently accessed data (Redis if needed)
- Use pagination for large datasets
- Avoid N+1 queries; use `.populate()` wisely

### Frontend

- Code splitting with React.lazy() for large pages
- Optimize images (compress, use appropriate formats)
- Memoize expensive computations with useMemo
- Use React.memo for components that don't need frequent re-renders
- Debounce search inputs and API calls

---

## Quick Reference

### Essential Commands

```bash
# Install dependencies
cd server && npm install
cd client && npm install

# Development
cd server && npm run dev     # Start backend
cd client && npm run dev     # Start frontend

# Testing
npm test                     # Run tests
npm run test:coverage        # With coverage

# Linting
npm run lint                 # Check
npm run lint:fix             # Fix

# Build
cd client && npm run build   # Build frontend for production

# Common troubleshooting
rm -rf node_modules package-lock.json && npm install  # Fresh install
npm audit fix                # Fix security vulnerabilities
```

### Key Files to Check

- `coding-standards.md`: Comprehensive coding guidelines
- `server/server.js`: Backend entry point and configuration
- `server/config/database.js`: MongoDB connection
- `client/src/main.jsx`: Frontend entry point
- `client/src/App.jsx`: Root React component
- `client/src/routes/`: Routing configuration
- `.env.example`: Environment variable templates

---

## Instructions for AI Coding Agents

**READ THIS CAREFULLY:**

1. **ALWAYS read `coding-standards.md` first** before making any code changes. It contains detailed patterns and conventions.

2. **Follow the established structure:** Don't create new patterns; use existing ones documented in coding standards.

3. **Environment setup:** If starting fresh, scaffold using standard MERN tools (Vite for frontend, Express generator for backend if helpful).

4. **Dependencies:** Check package.json for existing libraries before adding new ones. Reuse existing dependencies.

5. **Testing:** Write tests for new features following existing test patterns. Run tests before committing.

6. **Error handling:** Use the standardized error handling middleware and response format.

7. **Validation:** Validate inputs on both client and server sides.

8. **Security:** Never commit secrets. Always sanitize inputs. Use authentication middleware for protected routes.

9. **Search efficiently:**
   - Use `grep` to find patterns in code (e.g., `grep -r "apiClient" client/src/`)
   - Check existing files before creating new ones
   - Look for similar implementations before implementing new features

10. **Trust these instructions:** The build, test, and development workflows documented here have been validated. If something doesn't work as described, it's likely due to missing setup steps (e.g., MongoDB not running, environment variables not set).

11. **Small, focused changes:** Make minimal modifications to achieve the goal. Don't refactor unrelated code.

12. **Responsive design:** All UI components must work on desktop, tablet, and mobile (use responsive CSS or frameworks like Tailwind/Bootstrap).

---

**Document Version:** 1.0  
**Last Validated:** 2025-12-22  
**Page Count:** ~4 pages (within limit)
