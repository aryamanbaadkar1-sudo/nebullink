# NebulaLink — SUPER SIMPLE SETUP

## What You Need First

**PostgreSQL must be installed and running.**

### Check if PostgreSQL is installed:
```bash
# Try this command:
postgres --version
```

If you see a version number, PostgreSQL is installed ✅

If you get an error, **you need to install PostgreSQL first**:
- Download from: https://www.postgresql.org/download/windows/
- During installation, remember the password you set for user `postgres`

---

## 🚀 ACTUAL SETUP (3 Commands)

### **STEP 1: Update Password**

The app is currently set to use password: `postgres`

If your PostgreSQL password is different, tell me and I'll update it.

Common passwords people use:
- `postgres` (default)
- `admin`
- `password`
- `root`

---

### **STEP 2: Create Database & Run Migration**

Open **PowerShell** in the project folder and run:

```bash
cd C:\Users\arbbi\.gemini\antigravity\scratch\nebulalink\backend

npx prisma migrate dev --name init
```

**This will:**
- Create the `nebulalink` database automatically
- Create all tables (Users, Messages, etc.)

---

### **STEP 3: Start the App**

```bash
cd ..

npm run dev
```

**This starts everything!**

---

### **STEP 4: Open Browser**

Go to: **http://localhost:3000**

---

## ❌ If You Get Errors

### Error: "Can't reach database server"
**Problem:** PostgreSQL is not running

**Fix:** 
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find `postgresql-x64-XX` in the list
4. Right-click → Start

---

### Error: "password authentication failed"
**Problem:** Wrong password in the config

**Fix:** Tell me your PostgreSQL password and I'll update it

---

## 📝 TL;DR - Just Run These:

```bash
# 1. Go to backend folder
cd C:\Users\arbbi\.gemini\antigravity\scratch\nebulalink\backend

# 2. Create database and tables
npx prisma migrate dev --name init

# 3. Go back and start app
cd ..
npm run dev

# 4. Open browser
# http://localhost:3000
```

**That's it!** 🎉
