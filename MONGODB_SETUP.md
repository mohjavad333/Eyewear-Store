# MongoDB & Mongoose Setup Guide

This guide will help you set up MongoDB for the authentication system. Choose one of two options: **Local MongoDB** or **MongoDB Atlas (Cloud)**.

## Option 1: Local MongoDB Setup (Easiest for Development)

### macOS

**Using Homebrew:**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh
# Should show: test>
# Exit with: exit
```

**Manual Installation:**
1. Download from https://www.mongodb.com/try/download/community
2. Install the .dmg file
3. Run `mongod` from terminal

### Windows

**Using Chocolatey:**
```bash
choco install mongodb
```

**Manual Installation:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. MongoDB will start as a Windows Service automatically

**Start MongoDB:**
```bash
mongod
# Runs on localhost:27017
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify Local Installation

```bash
# Connect to MongoDB shell
mongosh

# You should see: test>

# List databases
show dbs

# Exit
exit
```

---

## Option 2: MongoDB Atlas (Cloud) Setup

### Create a Free Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email/Google
4. Accept terms and continue

### Create a Cluster

1. On dashboard, click "Create a Deployment"
2. Select **"Free"** tier
3. Choose a cloud provider (AWS/Google Cloud/Azure)
4. Select closest region to you
5. Click "Create Deployment"
6. Wait 5-10 minutes for cluster to initialize

### Set Database User

1. Go to **"Database Access"** (left sidebar)
2. Click "Add New Database User"
3. Enter username: `admin`
4. Enter password: (save this, you'll need it!)
5. Click "Add User"

### Get Connection String

1. Go to **"Database"** → Click **"Connect"**
2. Click "Drivers"
3. Select:
   - Driver: Node.js
   - Version: Latest
4. Copy the connection string
5. Replace `<password>` with your password
6. Replace `<username>` with `admin`

Example:
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/optics_store?retryWrites=true&w=majority
```

---

## Configure Your Project

### Step 1: Create .env File

Create `.env` in the project root:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/optics_store
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/optics_store?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
NODE_ENV=development
```

⚠️ **Important**: Never commit .env file (it's in .gitignore)

### Step 2: Verify Dependencies

Check that Mongoose is installed:

```bash
pnpm list mongoose bcryptjs jsonwebtoken
```

Should show:
- mongoose@9.x.x ✓
- bcryptjs@3.x.x ✓
- jsonwebtoken@9.x.x ✓

If missing, install:
```bash
pnpm add mongoose bcryptjs jsonwebtoken
```

---

## Create Demo Users

### Start Your App

```bash
# Terminal 1: Start MongoDB (if using local)
mongod

# Terminal 2: Start the dev server
pnpm run dev

# Terminal 3: Seed the database
npm run seed
```

### What Gets Created

The seed script creates two demo users:

**Demo Account:**
- Email: `demo@example.com`
- Password: `password123`
- Address: 123 Main St, New York, NY 10001

**Test Account:**
- Email: `john@example.com`
- Password: `TestPassword123`
- Address: 456 Oak Ave, Los Angeles, CA 90001

---

## Test the Setup

### Via Terminal

```bash
# Connect to MongoDB
mongosh

# Check databases
show dbs

# Connect to your database
use optics_store

# List collections
show collections

# View users
db.users.find()

# Exit
exit
```

### Via Web App

1. Navigate to `http://localhost:8080/login`
2. Enter:
   - Email: `demo@example.com`
   - Password: `password123`
3. Click "Sign In"
4. Should redirect to `/profile` if successful

---

## Troubleshooting

### "Cannot connect to MongoDB"

**Local MongoDB:**
```bash
# Check if mongod is running
# macOS: brew services list
# Windows: Services app, look for "MongoDB"
# Linux: sudo systemctl status mongod

# Start it manually
mongod

# Make sure port 27017 is available
lsof -i :27017  # macOS/Linux
netstat -ano | findstr :27017  # Windows
```

**MongoDB Atlas:**
- Check username/password in connection string
- Verify IP whitelist (Atlas → Network Access → Add Current IP)
- Check database name matches `.../optics_store?...`

### "User already exists"

Delete and recreate:

```bash
mongosh

use optics_store
db.users.deleteMany({})
exit

npm run seed
```

### Auth endpoints return "Database unavailable"

- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Restart the dev server after starting MongoDB

### Can't see what's in the database

Use MongoDB Compass (GUI):

1. Download: https://www.mongodb.com/products/compass
2. Connect using your MongoDB URI
3. Browse collections visually
4. View/edit documents easily

---

## Database Schema

### User Collection

```json
{
  "_id": ObjectId,
  "firstName": "Demo",
  "lastName": "User",
  "email": "demo@example.com",
  "password": "hashed_password",
  "phone": "+1 (555) 123-4567",
  "avatar": null,
  "addresses": [
    {
      "_id": ObjectId,
      "type": "shipping",
      "firstName": "Demo",
      "lastName": "User",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "USA",
      "isDefault": true
    }
  ],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

---

## Next Steps

After setup:

1. ✅ Test login with demo credentials
2. ✅ Update user profile
3. ✅ Add/edit addresses
4. ✅ Register new accounts
5. ✅ Test protected routes

---

## Security Notes

- ✓ Passwords are hashed with bcrypt (10 rounds)
- ✓ Tokens expire after 7 days
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use strong passwords in production
- ⚠️ Enable MongoDB authentication in production
- ⚠️ Use HTTPS in production
- ⚠️ Consider using environment variables service (Vercel, Netlify)

---

## Production Checklist

- [ ] Update JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable IP whitelist on MongoDB Atlas
- [ ] Set up automated backups
- [ ] Use environment variables for secrets
- [ ] Enable SSL/TLS for database connection
- [ ] Set up monitoring and logging
- [ ] Test password reset flow
- [ ] Set up email verification (future feature)
