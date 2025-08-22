# 🚀 Quick Start Guide - Store Rating System

## ✅ **SERVERS ARE NOW RUNNING!**

### 🌐 **Access Your Application:**

- **Frontend (React App):** http://localhost:3000
- **Backend (NestJS API):** http://localhost:3001
- **Registration Page:** http://localhost:3000/register
- **Login Page:** http://localhost:3000/login

---

## 🏃‍♂️ **How to Start Servers (If They Stop):**

### **Backend Server:**
```bash
cd backend
npm run start:dev
```
*Should start on http://localhost:3001*

### **Frontend Server:**
```bash
cd frontend
npm start
```
*Should start on http://localhost:3000*

---

## 🧪 **Test the Application:**

1. **Open Frontend:** Go to http://localhost:3000
2. **Register New User:** Click "Register" or go to http://localhost:3000/register
3. **Fill Registration Form:**
   - Name: 20-60 characters
   - Email: Valid email format
   - Password: 8-16 chars with uppercase + special character
   - Address: Up to 400 characters
   - Role: Choose Admin, Store Owner, or Normal User
4. **Login:** After registration, login with your credentials
5. **Explore:** Access role-based dashboards and features

---

## 🔧 **Current Configuration:**

- **Database:** SQLite in-memory (for demo purposes)
- **CORS:** Enabled for localhost:3000 and 3001
- **Authentication:** JWT tokens with role-based access
- **Validation:** Form validation and API validation enabled

---

## 🎯 **Key Features Working:**

✅ User Registration with Role Selection  
✅ User Login with JWT Authentication  
✅ Role-based Dashboards (Admin, Store Owner, User)  
✅ Form Validation with Real-time Feedback  
✅ Store Management System  
✅ Rating System  
✅ Protected Routes  
✅ Responsive Design  

---

## 🆘 **If Servers Stop Working:**

1. **Check if processes are running:**
   - Frontend should be on port 3000
   - Backend should be on port 3001

2. **Restart servers using the commands above**

3. **If issues persist:**
   - Close all terminals
   - Open new terminals
   - Navigate to project directories
   - Run start commands again

**Your Store Rating System is now fully operational! 🌟**
