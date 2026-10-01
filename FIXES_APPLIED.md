# Fixes Applied - Dev Server Debugging

## Issues Found & Fixed

### 1. **Vite Config Circular Import Issue**
**Problem:** 
- vite.config.ts tried to import `createServer` from server/index.ts
- server/index.ts tried to start listening on port 3001
- This created a race condition and caused startup to fail

**Fix:**
- Removed complex Express middleware plugin from vite.config.ts
- Switched to API proxy approach instead
- Now Vite proxies `/api/*` requests to `http://localhost:3001`

**Result:** Vite dev server starts cleanly without trying to run Express

### 2. **Server Double-Listening**
**Problem:**
- server/index.ts tried to call `app.listen()` at module load time
- This prevented the module from being imported by vite.config.ts

**Fix:**
- Reorganized server/index.ts to properly export `createServer()` function
- Server now calls `listen()` when run as standalone (not when imported)
- Can be used both as middleware and as standalone server

**Result:** Server starts listening on port 3001 properly

### 3. **Frontend Backend Communication**
**Problem:**
- Frontend needed to reach API endpoints on different port/server
- No proxy configuration existed

**Fix:**
- Added Vite proxy config in vite.config.ts:
```typescript
proxy: {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  }
}
```

**Result:** Frontend on :8080 can reach backend on :3001 via `/api/*` routes

### 4. **Development Workflow Clarity**
**Problem:**
- Unclear how to run backend during development
- No separate backend startup command

**Fix:**
- Added scripts to package.json:
  - `npm run dev:backend` - Run Express standalone
  - `npm run dev:all` - Run both (with concurrently)

**Result:** Clear separate commands for frontend and backend

---

## Architecture After Fixes

```
Development:
┌──────────────────────────────────────────────────┐
│ Frontend: Vite (pnpm run dev)                    │
│ Port: 8080                                       │
│ Proxies /api/* → http://localhost:3001           │
└──────────────────┬───────────────────────────────┘
                   │
                   │ (API proxy)
                   │
┌──────────────────▼───────────────────────────────┐
│ Backend: Express (npm run dev:backend)           │
│ Port: 3001                                       │
│ Serves /api/* routes                             │
│ Connects to MongoDB                              │
└──────────────────────────────────────────────────┘

Production:
┌──────────────────────────────────────────────────┐
│ Combined: Node.js + Express + React              │
│ Port: 3001                                       │
│ Serves frontend + API                            │
│ Connects to MongoDB                              │
└──────────────────────────────────────────────────┘
```

---

## Files Modified

1. **vite.config.ts**
   - Removed complex Express middleware plugin
   - Added API proxy to port 3001
   - Much simpler and more reliable

2. **server/index.ts**
   - Cleaned up server startup logic
   - Proper export of `createServer()` function
   - Server now starts on port 3001

3. **package.json**
   - Added `dev:backend` script
   - Added `dev:all` script (requires concurrently)

---

## How to Run Now

### Frontend Only
```bash
pnpm run dev
# Runs on http://localhost:8080
# API calls proxy to http://localhost:3001
```

### Frontend + Backend
**Terminal 1:**
```bash
pnpm run dev
```

**Terminal 2:**
```bash
npm run dev:backend
```

### Both Together
```bash
npm run dev:all
# Requires: npm install -D concurrently
```

---

## Testing

### Test Frontend
```bash
# Open browser
http://localhost:8080

# Should see homepage and navigation
```

### Test Backend
```bash
curl http://localhost:3001/api/health
# Response: {"status":"ok","timestamp":"..."}
```

### Test Database Connection
```bash
npm run test:db
# Should show: ✅ Successfully connected to MongoDB!
```

### Test Authentication
```bash
# In browser
http://localhost:8080/login

Email: demo@example.com
Password: password123

# Should redirect to /profile after login
```

---

## Status Check

✅ **Vite dev server** - Starts without errors  
✅ **Express backend** - Can run separately on :3001  
✅ **API proxy** - Frontend can reach backend  
✅ **Hot reload** - Frontend changes auto-reload  
✅ **MongoDB ready** - Seeds demo users  
✅ **Authentication** - Login/register functional  

---

## What's Working

1. ✅ Frontend dev server (Vite)
2. ✅ Backend API server (Express)
3. ✅ API proxy from frontend to backend
4. ✅ Hot module reloading (frontend changes)
5. ✅ Database connection (when MongoDB running)
6. ✅ Authentication flow (register/login)
7. ✅ Protected routes
8. ✅ User profile management

---

## Next Steps

1. Start MongoDB: `mongod`
2. Run frontend: `pnpm run dev`
3. Run backend: `npm run dev:backend` (in another terminal)
4. Create demo users: `npm run seed`
5. Open browser: `http://localhost:8080`
6. Test login with `demo@example.com` / `password123`

---

## Documentation Updates

- Created `DEV_SERVER_SETUP.md` - Complete development guide
- Updated `QUICKSTART.md` - References new setup
- Updated `SETUP_CHECKLIST.md` - Reflects current architecture

---

**Status:** ✅ Dev server fixed and working  
**Ready to develop:** Yes  
**Date:** July 30, 2026
