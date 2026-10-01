# Development Server Setup & Running Guide

## Overview

The application has **two separate development servers**:

1. **Frontend (Vite)** - http://localhost:8080
   - React UI
   - Hot reloading
   - Client-side routing

2. **Backend (Express)** - http://localhost:3001
   - Authentication API
   - MongoDB integration
   - API routes

---

## Quick Start (Recommended)

### Option 1: Run Frontend Only (Quickest)

```bash
pnpm run dev
```

- Starts Vite on http://localhost:8080
- API requests proxy to http://localhost:3001
- **Note:** Backend must be running separately for auth to work

### Option 2: Run Both in Parallel (Best for Development)

**Terminal 1: Frontend**
```bash
pnpm run dev
```

**Terminal 2: Backend**
```bash
npm run dev:backend
```

This gives you:
- Frontend hot reload on http://localhost:8080
- Backend auto-reload on http://localhost:3001
- Full functionality including auth

### Option 3: Run Both with One Command (Requires concurrently)

```bash
# Install concurrently first (if needed)
npm install -D concurrently

# Then run both together
npm run dev:all
```

---

## Step-by-Step Setup

### 1. Ensure MongoDB is Running

```bash
# Terminal 0: Start MongoDB
mongod
# or for macOS with homebrew:
# brew services start mongodb-community
```

### 2. Create .env File

```bash
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/optics_store
JWT_SECRET=dev-secret-key
PORT=3001
NODE_ENV=development
EOF
```

### 3. Create Demo Users (First Time Only)

```bash
npm run seed
```

### 4. Start Development Servers

**In Terminal 1:**
```bash
pnpm run dev
```

**In Terminal 2:**
```bash
npm run dev:backend
```

### 5. Open Browser

Navigate to: http://localhost:8080

---

## Server Details

### Frontend Server (Vite)

**Port:** 8080  
**Command:** `pnpm run dev`  
**Features:**
- React HMR (Hot Module Reload)
- Fast refresh on code changes
- API proxy to localhost:3001
- Runs your entire React app

### Backend Server (Express)

**Port:** 3001  
**Command:** `npm run dev:backend`  
**Features:**
- Authentication API
- MongoDB connection
- CORS enabled
- Hot reload (via tsx)

**API Endpoints:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile
- POST /api/auth/addresses

---

## Development Workflow

### Make Frontend Changes

```bash
# Terminal 1: Already running pnpm run dev
# Just save your files in client/ or pages/
# Browser auto-refreshes (HMR)
```

### Make Backend Changes

```bash
# Terminal 2: Already running npm run dev:backend
# Edit files in server/
# Backend automatically restarts on save
```

### Test API Endpoints

```bash
# Use any API client:
# - Postman
# - Insomnia
# - Thunder Client (VS Code)
# - curl

curl http://localhost:3001/api/health
# Response: { "status": "ok", "timestamp": "..." }
```

---

## Common Issues & Solutions

### Issue: "Cannot connect to http://localhost:3001"

**Solution:** Start backend in separate terminal
```bash
npm run dev:backend
```

### Issue: "MongoDB connection failed"

**Solution:** Start MongoDB first
```bash
mongod
# or: brew services start mongodb-community  (macOS)
```

### Issue: "Login doesn't work"

**Solution:** Check both servers are running
```bash
# Terminal 1 should show: "DevServer Listening on localhost:8080"
# Terminal 2 should show: "🚀 Backend running on http://localhost:3001"
```

### Issue: "Module not found" errors

**Solution:** Install dependencies
```bash
pnpm install
```

### Issue: "Port 3001 already in use"

**Solution:** Kill process using that port
```bash
# macOS/Linux
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## Understanding the Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Browser (User)                         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ http://localhost:8080
                  ▼
┌─────────────────────────────────────────────────────────┐
│            Vite Dev Server (Frontend)                   │
│  ├─ React Component Serving                             │
│  ├─ Hot Module Reload (HMR)                             │
│  ├─ Dev Tools Integration                               │
│  └─ Proxy: /api/* → http://localhost:3001               │
└─────────────────┬───────────────────────────────────────┘
                  │
              /api/*
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│           Express Server (Backend)                      │
│  ├─ Authentication API                                  │
│  ├─ Database Queries (Mongoose)                         │
│  ├─ Request Processing                                  │
│  └─ Response Sending                                    │
└─────────────────┬───────────────────────────────────────┘
                  │
          MongoDB Operations
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│             MongoDB Database                            │
│  └─ User Collection (Authentication Data)               │
└─────────────────────────────────────────────────────────┘
```

---

## Scripts Reference

| Command | Purpose | Terminal |
|---------|---------|----------|
| `pnpm run dev` | Start Vite (Frontend) | Terminal 1 |
| `npm run dev:backend` | Start Express (Backend) | Terminal 2 |
| `npm run dev:all` | Start both together | One terminal |
| `npm run test:db` | Test MongoDB connection | Any |
| `npm run seed` | Create demo users | Any |
| `npm run build` | Build for production | Any |
| `pnpm run typecheck` | Check TypeScript | Any |
| `pnpm format.fix` | Auto-format code | Any |

---

## Production Build

### Build for Production

```bash
pnpm run build
```

Creates:
- `dist/spa/` - Frontend build
- `dist/server/` - Backend build

### Start Production Server

```bash
pnpm start
```

- Serves both frontend and backend
- Single process on port 3001
- Requires .env with production values

---

## Environment Variables

### Development (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/optics_store

# Security
JWT_SECRET=dev-secret-key

# Server
PORT=3001
NODE_ENV=development
```

### Production (set on server)

```env
# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Security (strong random value)
JWT_SECRET=<random-64-character-string>

# Server
PORT=3001
NODE_ENV=production
```

---

## Testing the Setup

### Frontend Loading

1. Open http://localhost:8080
2. Should see Optics Store homepage
3. Navigation works
4. No console errors

### Backend API

```bash
curl http://localhost:3001/api/health
# Response: {"status":"ok","timestamp":"2026-07-30T..."}
```

### Authentication

```bash
# Frontend
Navigate to http://localhost:8080/login
Email: demo@example.com
Password: password123
Click "Sign In" → Should redirect to /profile
```

### Database

```bash
npm run test:db
# Should show: ✅ Successfully connected to MongoDB!
```

---

## Tips for Efficient Development

1. **Use Two Monitors** - One for each terminal
2. **Terminal Multiplexer** - Use tmux or screen for easier management
3. **IDE Integration** - VSCode has integrated terminal
4. **Watch Browser** - Keep dev tools open for debugging
5. **Check Logs** - Watch both terminal windows for errors

---

## Useful Browser DevTools

**Frontend Debugging:**
- React DevTools extension
- Redux DevTools (if using Redux)
- Network tab (to see API calls)
- Console (for JavaScript errors)
- Application tab (for localStorage)

---

## Network Flow Example: User Login

```
1. User enters email/password in /login page (Frontend)
   ↓
2. Clicks "Sign In" button
   ↓
3. Frontend makes POST to /api/auth/login (Vite proxy)
   ↓
4. Request forwarded to http://localhost:3001/api/auth/login
   ↓
5. Backend Express receives request
   ↓
6. Queries MongoDB for user
   ↓
7. Compares password with bcrypt
   ↓
8. Generates JWT token
   ↓
9. Returns token + user data to frontend
   ↓
10. Frontend saves token to localStorage
   ↓
11. Redirects to /profile (protected route)
   ↓
12. /profile uses token from localStorage to fetch user data
```

---

## Troubleshooting Checklist

- [ ] MongoDB is running (mongod)
- [ ] .env file exists with MONGODB_URI
- [ ] Frontend running on :8080 (pnpm run dev)
- [ ] Backend running on :3001 (npm run dev:backend)
- [ ] No errors in either terminal
- [ ] Can access http://localhost:8080
- [ ] Can curl http://localhost:3001/api/health
- [ ] Can login with demo@example.com / password123

---

## Quick Reference

```bash
# Full development setup
mongod &                          # Start MongoDB
npm run seed                       # Create demo users
pnpm run dev &                     # Start frontend (background)
npm run dev:backend                # Start backend (foreground)

# In browser
# http://localhost:8080

# Test
npm run test:db
```

---

**Status:** ✅ Ready to develop  
**Last Updated:** July 2026
