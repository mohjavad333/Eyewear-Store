# MongoDB & Authentication Setup Checklist

Follow these steps to get the authentication system fully working with MongoDB.

## ✅ Phase 1: MongoDB Installation (Choose One)

### Option A: Local MongoDB (Recommended for Development)

- [ ] **macOS**: `brew install mongodb-community && brew services start mongodb-community`
- [ ] **Windows**: Download from mongodb.com/try/download/community, run installer
- [ ] **Linux**: Follow instructions in MONGODB_SETUP.md
- [ ] **Verify**: Run `mongosh` in terminal - should show `test>`

### Option B: MongoDB Atlas (Cloud)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create a cluster (free tier, ~5-10 min)
- [ ] Add database user (username: admin)
- [ ] Get connection string
- [ ] Save for next step

---

## ✅ Phase 2: Configure Environment

- [ ] Create `.env` file in project root
- [ ] Add `MONGODB_URI`:
  - **Local**: `mongodb://localhost:27017/optics_store`
  - **Atlas**: `mongodb+srv://admin:PASSWORD@cluster.mongodb.net/optics_store?retryWrites=true&w=majority`
- [ ] Add `JWT_SECRET=your-secret-key-change-in-production`
- [ ] Add `PORT=3001`
- [ ] Add `NODE_ENV=development`

Example `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/optics_store
JWT_SECRET=dev-secret-key-123-change-in-production
PORT=3001
NODE_ENV=development
```

---

## ✅ Phase 3: Install Dependencies

- [ ] Run: `pnpm install`
- [ ] Verify: `pnpm list mongoose bcryptjs jsonwebtoken`
- [ ] All should show version numbers (✓)

---

## ✅ Phase 4: Test MongoDB Connection

- [ ] **Terminal 1**: Start MongoDB (if local): `mongod`
- [ ] **Terminal 2**: Test connection: `npm run test:db`
- [ ] Should see: `✅ Successfully connected to MongoDB!`

**If connection fails:**
- [ ] Check MongoDB is running
- [ ] Check MONGODB_URI in .env
- [ ] For Atlas: whitelist your IP in MongoDB Atlas dashboard
- [ ] See MONGODB_SETUP.md for troubleshooting

---

## ✅ Phase 5: Create Demo Users

- [ ] Run: `npm run seed`
- [ ] Should see both demo users created:
  - `✓ Demo user created successfully`
  - `✓ Test user created successfully`

**Demo Credentials Created:**
- Email: `demo@example.com` / Password: `password123`
- Email: `john@example.com` / Password: `TestPassword123`

---

## ✅ Phase 6: Start Development Server

- [ ] Run: `pnpm run dev`
- [ ] Should see:
  - `✓ Connected to MongoDB`
  - `🚀 Server running on http://localhost:3001`
  - `DevServer Listening on localhost:8080`

---

## ✅ Phase 7: Test Authentication

### Test Login Flow

- [ ] Open browser: http://localhost:8080/login
- [ ] Enter email: `demo@example.com`
- [ ] Enter password: `password123`
- [ ] Click "Sign In"
- [ ] Should redirect to `/profile`
- [ ] Should see: "Welcome, Demo!"

### Test Registration

- [ ] Go to: http://localhost:8080/register
- [ ] Fill form with new user details
- [ ] Agree to terms
- [ ] Click "Create Account"
- [ ] Should redirect to `/profile` with auto-login

### Test Protected Route

- [ ] Logout from profile
- [ ] Try to visit: http://localhost:8080/profile
- [ ] Should redirect to `/login` (protected!)

### Test Header Status

- [ ] When logged in: Header shows profile icon + logout button
- [ ] When logged out: Header shows "Sign In" button

---

## ✅ Phase 8: Verify Database

### Via mongosh Terminal

```bash
mongosh
use optics_store
db.users.find()
# Should show your demo users and any new registrations
exit
```

### Via Web UI (MongoDB Compass)

- [ ] Download: https://www.mongodb.com/products/compass
- [ ] Connect with MONGODB_URI
- [ ] Browse optics_store → users
- [ ] See all registered users visually

---

## 🎉 Success! What's Working Now

✅ **User Registration**
- Create new accounts with email/password
- Password strength validation
- Automatic login after registration

✅ **User Login**
- Login with email and password
- JWT token generation (7 days)
- Persistent login (localStorage)
- Secure token handling

✅ **Protected Routes**
- `/profile` requires login
- Auto-redirect to login if not authenticated
- Loading state while checking auth

✅ **User Profile**
- View user information
- Update profile details
- Manage addresses

✅ **Database**
- MongoDB connection working
- Mongoose models configured
- User data persistence

---

## 🚀 Next Features to Build

Now that auth is working:

1. **Product Details** - View full product information
2. **Order Management** - Track user orders
3. **Wishlist Sync** - Save wishlist to database
4. **Order History** - View past purchases
5. **Password Reset** - Email-based password recovery
6. **Email Verification** - Verify email on signup
7. **Admin Panel** - Manage products and users
8. **2FA** - Two-factor authentication

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongosh
# or for local: mongod
```

### "Email already registered"
```bash
# Delete specific user
mongosh
use optics_store
db.users.deleteOne({ email: "test@example.com" })
exit
```

### "Clear all users and start fresh"
```bash
# Delete all users
mongosh
use optics_store
db.users.deleteMany({})
exit
npm run seed
```

### Login not working
- [ ] Check MONGODB_URI in .env
- [ ] Verify MongoDB is running
- [ ] Check browser console for errors (F12)
- [ ] Restart dev server

### Seed script fails
- [ ] Ensure MongoDB is running
- [ ] Check MONGODB_URI connects successfully (`npm run test:db`)
- [ ] Delete existing records: `db.users.deleteMany({})`
- [ ] Run seed again: `npm run seed`

---

## 📝 Environment Variables Reference

```env
# MongoDB Connection String
# Local: mongodb://localhost:27017/database-name
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/database-name?retryWrites=true&w=majority
MONGODB_URI=

# JWT Secret for token signing (MUST change in production!)
JWT_SECRET=

# Server Port
PORT=3001

# Node Environment
NODE_ENV=development
```

---

## 🔒 Security Notes

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens expire after 7 days
- ✅ Tokens stored in localStorage (accessible but secure)
- ⚠️ **TODO for production:**
  - Change JWT_SECRET
  - Use HTTPS
  - Enable MongoDB authentication
  - Use environment variables service
  - Set secure HttpOnly cookies (optional)
  - Add rate limiting
  - Add email verification
  - Add password reset flow

---

## 📞 Support

If you encounter issues:

1. Check MONGODB_SETUP.md for detailed instructions
2. Check DEBUG_FIXES.md for known fixes
3. Run `npm run test:db` to diagnose connection issues
4. Check browser console (F12) for frontend errors
5. Check terminal logs for backend errors

---

## ✨ Quick Commands Reference

```bash
# Test MongoDB connection
npm run test:db

# Create demo users
npm run seed

# Start dev server
pnpm run dev

# View database
mongosh

# Delete all users and reset
npm run seed

# Check installed packages
pnpm list mongoose bcryptjs jsonwebtoken
```

---

**Last Updated**: July 2026  
**Status**: ✅ Complete and tested
