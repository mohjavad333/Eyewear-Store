# 📜 Available NPM Scripts Reference

All commands to help you work with the project, MongoDB, and authentication.

## Development Scripts

### Start Development Server
```bash
pnpm run dev
```
- Starts Vite dev server on http://localhost:8080
- Starts Express backend on http://localhost:3001
- Hot reloading enabled
- Connect to MongoDB automatically

### Build for Production
```bash
pnpm run build
```
- Builds React frontend
- Builds Node.js backend
- Output: `dist/` folder

### Start Production Server
```bash
pnpm start
```
- Runs production build
- Requires build to be run first
- Serves frontend and backend

---

## Database Scripts

### Test MongoDB Connection
```bash
npm run test:db
```
**What it does:**
- Checks if MongoDB is running
- Verifies MONGODB_URI in .env
- Shows database stats
- Lists collections
- Shows registered users
- Provides helpful error messages

**Expected output:**
```
✅ Successfully connected to MongoDB!
📊 Available databases: 1
📋 Collections in "optics_store": (empty)
👥 Users in database: 0
```

**Use this when:**
- First time setup
- Troubleshooting connection issues
- Verifying MongoDB is working

---

### Create Demo Users
```bash
npm run seed
```
**What it does:**
- Connects to MongoDB
- Deletes existing demo users (if any)
- Creates two test accounts:
  - demo@example.com / password123
  - john@example.com / TestPassword123
- Shows success messages

**Expected output:**
```
Connected to MongoDB
✓ Demo user created successfully
✓ Test user created successfully
```

**Use this when:**
- First time setup (after MongoDB)
- Resetting database
- Need fresh demo accounts

**Note:** If "User already exists" error, the users are still in database. You can safely run again.

---

## Code Quality Scripts

### Format Code
```bash
pnpm format.fix
```
- Runs Prettier on all files
- Fixes formatting issues
- Uses project's prettier config

### Type Checking
```bash
pnpm typecheck
```
- Checks TypeScript for errors
- No compilation, just checking
- Helps find issues before runtime

### Run Tests
```bash
pnpm test
```
- Runs Vitest (testing framework)
- Single run (doesn't watch)
- Good for CI/CD pipelines

---

## Complete Script List

### From package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "vite build --config vite.config.server.ts",
    "start": "node dist/server/node-build.mjs",
    "test": "vitest --run",
    "format.fix": "prettier --write .",
    "typecheck": "tsc",
    "seed": "tsx server/scripts/seedDB.ts",
    "test:db": "tsx server/scripts/testConnection.ts"
  }
}
```

---

## Usage Scenarios

### 🚀 First Time Setup

```bash
# 1. Test MongoDB connection
npm run test:db

# 2. Create demo users
npm run seed

# 3. Start dev server
pnpm run dev

# 4. Open browser
# http://localhost:8080/login
# Email: demo@example.com
# Password: password123
```

---

### 💻 Daily Development

```bash
# 1. Start dev server (in project root)
pnpm run dev

# 2. (In another terminal) Make code changes
# Files auto-reload

# 3. Check for TypeScript errors
pnpm typecheck

# 4. Format code
pnpm format.fix

# 5. Run tests (if you add any)
pnpm test
```

---

### 🔧 Troubleshooting

```bash
# Check MongoDB connection
npm run test:db

# See what users exist
npm run test:db  # Shows users in "👥 Users in database"

# Reset to fresh state
npm run seed     # Re-creates demo users

# Restart dev server
# Ctrl+C in terminal, then:
pnpm run dev
```

---

### 📦 Deploying to Production

```bash
# 1. Test everything locally
pnpm run dev
# (test features)

# 2. Check for errors
pnpm typecheck

# 3. Format code
pnpm format.fix

# 4. Build for production
pnpm build

# 5. Test production build
pnpm start

# 6. Deploy (push to GitHub, Vercel, Netlify, etc.)
git push origin main
```

---

## Environment-Specific Scripts

### Development
- `pnpm run dev` - Development with hot reload
- `npm run test:db` - Test MongoDB connection
- `npm run seed` - Create demo data
- `pnpm typecheck` - Check types

### Testing
- `pnpm test` - Run test suite
- `npm run test:db` - Test database connection

### Production
- `pnpm build` - Build for production
- `pnpm start` - Run production server

---

## Script Dependencies

```
Frontend Development
  ├── pnpm run dev      (starts Vite dev server)
  └── Uses hot reloading

Backend Development
  ├── pnpm run dev      (starts Express server via Vite plugin)
  ├── npm run test:db   (test connection)
  └── npm run seed      (create demo data)

Production
  ├── pnpm build        (builds both client and server)
  │   ├── build:client  (builds React)
  │   └── build:server  (builds Node.js)
  ├── pnpm start        (runs production build)
  └── Requires .env with production values
```

---

## Troubleshooting Script Issues

### "command not found: npm run test:db"

**Solution:** Use `pnpm` instead if project uses pnpm:
```bash
pnpm test:db
# or
npm run test:db  # Both should work
```

### Script runs but MongoDB connection fails

**Solution:** Ensure MongoDB is running:
```bash
# Terminal 1
mongod

# Terminal 2
npm run test:db
```

### Dev server won't start

**Solution:** Check for port conflicts:
```bash
# Kill process using port 3001
lsof -i :3001        # macOS/Linux
# or Windows: netstat -ano | findstr :3001
```

---

## Performance Tips

### Faster Development
- Use `pnpm` instead of `npm` (2-3x faster)
- Use hot reload (pnpm run dev) for instant updates
- Avoid full rebuilds when possible

### Code Quality
- Run `pnpm typecheck` before committing
- Run `pnpm format.fix` to auto-fix formatting
- Run `pnpm test` in CI/CD pipeline

---

## Useful Command Combinations

```bash
# Full development setup
npm run test:db && npm run seed && pnpm run dev

# Code quality check
pnpm typecheck && pnpm format.fix

# Build and test production
pnpm build && pnpm start

# Development with fresh data
npm run seed && pnpm run dev
```

---

## Need Help?

- Check QUICKSTART.md for 5-minute setup
- Check SETUP_CHECKLIST.md for detailed steps
- Check MONGODB_SETUP.md for database setup
- Check DEBUG_FIXES.md for known issues
- Run `npm run test:db` to diagnose problems

---

**Last Updated:** July 2026  
**Project:** Optics Store + Authentication  
**Status:** ✅ Ready to use
