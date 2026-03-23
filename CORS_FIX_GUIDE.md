# 🔧 CORS Error - Troubleshooting Guide

**Issue:** Cross-Origin Request Blocked: CORS error when connecting frontend to backend

---

## ✅ FIXES APPLIED

1. **Fixed CORS Middleware Ordering** ✅
   - Moved CORS before other middleware
   - Added OPTIONS method support (needed for preflight requests)
   - Added proper headers configuration

2. **Added Request Interceptors** ✅
   - Better error handling in axios
   - Clear error messages for network issues
   - Timeout set to 10 seconds

3. **Fixed Environment Variable Validation** ✅
   - Changed `MONGODB_URI` → `MONGO_URI` (matches your .env)
   - Better error messages if env vars are missing

4. **Better Database Error Handling** ✅
   - Throws errors properly so server knows connection failed
   - Timeout settings for MongoDB connection
   - Clear console logs showing success/failure

5. **Added Health Check Endpoint** ✅
   - Can test if backend is running at `/health`

---

## 🚀 TO FIX THE CORS ERROR:

### Step 1: Make Sure Backend is Running

Run this in the `backend` folder:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Server running on http://localhost:5050
✅ API: http://localhost:5050/api
✅ Health check: http://localhost:5050/health
```

### Step 2: Test the Backend Health

In your browser, visit: http://localhost:5050/health

You should see:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

If this doesn't work, the backend is not running.

### Step 3: Make Sure Frontend is on Port 3000

Run this in the `frontend` folder:

```bash
npm run dev
```

Frontend should be on: http://localhost:3000

### Step 4: Check Your .env File

In `backend/.env`, ensure you have:

```
MONGO_URI=mongodb+srv://balaji:balaji@cluster0.qakexyh.mongodb.net/?appName=Cluster0
PORT=5050
JWT_SECRET=afasdfklasodfj123joasdnf
```

---

## 🔍 TROUBLESHOOTING STEPS

### Issue 1: Backend Not Running
**Symptoms:** Cannot visit http://localhost:5050/health

**Solution:**
```bash
cd backend
npm install  # If dependencies are missing
npm run dev  # Start the server
```

### Issue 2: MongoDB Connection Failed
**Symptoms:** See "❌ MongoDB connection error" in console

**Solution:**
- Check your internet connection
- Verify MongoDB URI is correct
- Check if MongoDB cluster is active in MongoDB Atlas
- Check whitelist IP address in MongoDB Atlas (should include your IP or 0.0.0.0)

### Issue 3: Port 5050 Already in Use
**Symptoms:** "Error: listen EADDRINUSE :::5050"

**Solution:**
```bash
# Find process using port 5050 (Windows PowerShell)
netstat -ano | findstr :5050

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F

# Or change PORT in .env to something else like 5051
```

### Issue 4: CORS Still Failing
**Symptoms:** Still getting CORS error despite fixes

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for detailed error
4. Make sure both servers are running on correct ports

---

## 📋 CHECKLIST

- [ ] Backend running on http://localhost:5050
- [ ] Frontend running on http://localhost:3000
- [ ] Can visit http://localhost:5050/health and see response
- [ ] MongoDB connection shows "✅ MongoDB connected"
- [ ] All environment variables set in backend/.env
- [ ] Browser cache cleared
- [ ] Try logging in again

---

## 🧪 TEST YOUR SETUP

### Automated Test
Open browser DevTools (F12) and paste this in console:

```javascript
fetch('http://localhost:5050/health', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(data => console.log('✅ Backend OK:', data))
  .catch(e => console.error('❌ Backend Error:', e.message))
```

If you see `✅ Backend OK:`, then CORS is working!

---

## 📝 WHAT CHANGED

### Backend (server.js)
- ✅ Fixed CORS middleware ordering
- ✅ Added OPTIONS method support
- ✅ Added health check endpoint
- ✅ Fixed environment variable validation
- ✅ Better error handling

### Frontend (axios.js)
- ✅ Added request interceptors
- ✅ Improved error messages
- ✅ Added request timeout

### Database (config/db.js)
- ✅ Better error handling
- ✅ Connection timeout settings
- ✅ Throws errors properly

---

## ⚡ COMMON MISTAKES

❌ **Frontend and backend on same port** → Each needs different port  
❌ **Backend not running** → Always start with `npm run dev`  
❌ **Wrong URL in axios** → Should be `http://localhost:5050/api`  
❌ **Missing environment variables** → Check .env file exists  
❌ **Stale browser cache** → Use Ctrl+Shift+Del to clear  
❌ **Credentials not included** → Axios already has `withCredentials: true`  

---

## 📞 STILL NOT WORKING?

1. Check backend console for errors
2. Check frontend browser DevTools (F12) console
3. Test http://localhost:5050/health in browser
4. Restart both servers
5. Clear browser cache

**If MongoDB fails:**
- Check internet connection
- Verify MongoDB URI is correct
- Check MongoDB Atlas whitelist IPs
- Check if cluster is paused (it gets paused after 3 months of inactivity)

---

**Generated:** March 21, 2026  
**CORS Status:** ✅ FIXED
