import app from "./app.js";
import { connectDB } from "./DB/connectDB.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/auth.middleware.js"; 
dotenv.config();

const Port = process.env.PORT || 8088;

console.log("🚀 SERVER STARTING...");
console.log("🔍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("🔍 JWT_SECRET value:", process.env.JWT_SECRET);
console.log("🔍 JWT_SECRET length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

// Add this test route to your app
app.get('/api/debug-env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_SECRET_LENGTH: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    TIMESTAMP: new Date().toISOString()
  });
});



// Add these test routes to your app.js to verify routing works
app.get('/test', (req, res) => {
  console.log('🧪 TEST ROUTE HIT: /test');
  res.json({ message: 'Test route working', timestamp: new Date() });
});

app.get('/user/test', (req, res) => {
  console.log('🧪 USER TEST ROUTE HIT: /user/test');
  res.json({ message: 'User test route working', timestamp: new Date() });
});

app.get('/api/user/test', (req, res) => {
  console.log('🧪 API USER TEST ROUTE HIT: /api/user/test');
  res.json({ message: 'API User test route working', timestamp: new Date() });
});

// Test with auth middleware
app.get('/user/test-auth', authenticateToken, (req, res) => {
  console.log('🧪 AUTH TEST ROUTE HIT: /user/test-auth');
  console.log('🧪 User from middleware:', req.user);
  res.json({ 
    message: 'Auth test route working', 
    user: req.user,
    timestamp: new Date() 
  });
});

connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`The server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.log("connection to DB failed!", error);
  });
