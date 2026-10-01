# Authentication System Setup Guide

This project includes a complete authentication system with Node.js/Express backend and MongoDB database.

## Overview

The authentication system provides:
- User registration and login
- JWT token-based authentication
- Protected routes
- User profile management
- Address management
- Password hashing with bcrypt

## Prerequisites

- Node.js 18+
- MongoDB 4.4+ (local or Atlas)
- npm or pnpm

## Backend Setup

### 1. Install Dependencies

```bash
npm install mongoose bcryptjs jsonwebtoken
npm install --save-dev @types/node
```

These are already included in package.json.

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/optics_store

# JWT Secret (change this in production!)
JWT_SECRET=your-secret-key-change-in-production

# Server Port
PORT=3001

# Environment
NODE_ENV=development
```

### 3. MongoDB Connection Options

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/optics_store
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/optics_store?retryWrites=true&w=majority
```

To set up MongoDB Atlas:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Replace `username`, `password`, and `cluster` in the URI

### 4. Seed Demo User

Run the seed script to create demo users:

```bash
npm run seed
```

This creates:
- Email: `demo@example.com`, Password: `password123`
- Email: `john@example.com`, Password: `TestPassword123`

### 5. Start Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

## Frontend Setup

### Authentication Context

The `client/context/AuthContext.tsx` manages:
- User authentication state
- Token storage in localStorage
- Login/register functions
- Protected route access

### Protected Routes

Use `ProtectedRoute` component to restrict access:

```tsx
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

### Using Authentication in Components

```tsx
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome, {user?.firstName}!</div>;
  }

  return <div>Please log in</div>;
}
```

## API Endpoints

### Authentication Routes

#### POST /api/auth/register
Register a new user
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### GET /api/auth/me
Get current user (requires authentication)
```
Authorization: Bearer <token>
```

#### PUT /api/auth/profile
Update user profile (requires authentication)
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1-555-0123",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### POST /api/auth/addresses
Add address (requires authentication)
```json
{
  "type": "shipping",
  "firstName": "Jane",
  "lastName": "Doe",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA",
  "isDefault": true
}
```

#### DELETE /api/auth/addresses/:id
Delete address (requires authentication)

#### POST /api/auth/logout
Logout (client-side token removal recommended)

## Folder Structure

```
server/
├── db.ts                 # MongoDB connection
├── index.ts             # Express app setup
├── middleware/
│   └── auth.ts          # JWT authentication middleware
├── models/
│   └── User.ts          # User schema and model
├── routes/
│   └── auth.ts          # Authentication endpoints
└── scripts/
    └── seedDB.ts        # Database seed script

client/
├── context/
│   └── AuthContext.tsx  # Authentication context
├── pages/
│   ├── Login.tsx        # Login page
│   └── Register.tsx     # Registration page
└── components/
    └── ProtectedRoute.tsx # Protected route wrapper
```

## Security Considerations

- ✓ Passwords hashed with bcrypt (10 salt rounds)
- ✓ JWT tokens with 7-day expiration
- ✓ CORS enabled for secure cross-origin requests
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Set secure HttpOnly cookies for tokens (optional enhancement)

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running locally: `mongod`
- Or check MongoDB Atlas connection string
- Verify MONGODB_URI in .env

### "Token invalid or expired"
- Clear localStorage in browser dev tools
- Log out and log back in
- Check JWT_SECRET matches between frontend and backend

### "CORS errors"
- Verify cors() middleware is enabled in server/index.ts
- Check FRONTEND_URL environment variable

### "User not found"
- Run the seed script: `npm run seed`
- Or manually create a user through registration page

## Next Steps

1. Customize the User model for additional fields
2. Add email verification
3. Implement password reset flow
4. Add role-based access control (admin, user)
5. Implement refresh tokens
6. Add 2FA (two-factor authentication)

## Testing Demo Account

**Email:** demo@example.com  
**Password:** password123

Use this account to test the authentication flow without creating a new account.
