# 🚀 Quick Start: MongoDB & Authentication

Get up and running in 5 minutes!

## Step 1: Start MongoDB (Choose One)

### Local MongoDB
```bash
# macOS
brew services start mongodb-community

# Windows
# Open Services app, search "MongoDB", click Start
# OR run: mongod

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account & cluster (free tier)
3. Get connection string
4. Skip to Step 2

## Step 2: Create .env File

```bash
# Create .env in project root
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/optics_store
JWT_SECRET=dev-secret-change-in-production
PORT=3001
NODE_ENV=development
EOF
```

**For MongoDB Atlas**, replace first line:
```
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/optics_store?retryWrites=true&w=majority
```

## Step 3: Test Connection

```bash
npm run test:db
```

Should show: `✅ Successfully connected to MongoDB!`

## Step 4: Create Demo Users

```bash
npm run seed
```

Creates:
- demo@example.com / password123
- john@example.com / TestPassword123

## Step 5: Start Dev Server

```bash
pnpm run dev
```

Opens: http://localhost:8080

## Step 6: Test Login

1. Go to: http://localhost:8080/login
2. Email: demo@example.com
3. Password: password123
4. Click "Sign In" ✨

Done! Authentication is now working.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Can't connect to MongoDB | Run `mongod` (local) or check Atlas IP whitelist |
| "Email already exists" | Delete with: `npm run seed:reset` |
| Auth endpoints return 503 | Restart dev server after starting MongoDB |
| Login doesn't work | Check `.env` MONGODB_URI |

---

## What You Can Do Now

✅ Register new accounts  
✅ Login with email/password  
✅ View profile (protected route)  
✅ Update user information  
✅ Manage addresses  
✅ Logout  

---

## Files Created

- `server/models/User.ts` - User schema with password hashing
- `server/routes/auth.ts` - Login/register endpoints
- `client/pages/Login.tsx` - Login page
- `client/pages/Register.tsx` - Registration page
- `client/context/AuthContext.tsx` - Auth state management

---

## Next: Use Authentication in Components

```typescript
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      Welcome, {user?.firstName}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

For detailed setup: See `MONGODB_SETUP.md` & `SETUP_CHECKLIST.md`
