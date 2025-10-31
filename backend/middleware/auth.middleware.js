// import jwt from "jsonwebtoken";

// export function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"] || req.cookies?.token;
//   const token =
//     authHeader && authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : authHeader;

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET || "dev-secret", (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = user;
//     next();
//   });
// }

// export function authorizeRole(...allowedRoles) {
//   return (req, res, next) => {
//     const userRole = req.user?.role;

//     if (!userRole || !allowedRoles.includes(userRole)) {
//       return res.status(403).json({
//         message: "Forbidden - insufficient permissions",
//         requiredRoles: allowedRoles,
//         userRole: userRole || "user",
//       });
//     }

//     next();
//   };
// }





// import jwt from "jsonwebtoken";

// export function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"] || req.cookies?.token;
//   const token =
//     authHeader && authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : authHeader;

//   console.log("🔍 Middleware received token:", token ? token.substring(0, 50) : "null");
//   console.log("🔍 Middleware JWT_SECRET:", process.env.JWT_SECRET);
//   console.log("🔍 Middleware JWT_SECRET length:", process.env.JWT_SECRET?.length);

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET || "dev-secret", (err, user) => {
//     if (err) {
//       console.log("❌ Token verification failed:", err.message);
//       return res.status(403).json({ message: "Invalid token" });
//     }
//     console.log("✅ Token verified in middleware:", user);
//     req.user = user;
//     next();
//   });
// }



// export function authorizeRole(...allowedRoles) {
//   return (req, res, next) => {
//     const userRole = req.user?.role;

//     if (!userRole || !allowedRoles.includes(userRole)) {
//       return res.status(403).json({
//         message: "Forbidden - insufficient permissions",
//         requiredRoles: allowedRoles,
//         userRole: userRole || "user",
//       });
//     }

//     next();
//   };
// }







import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export function authenticateToken(req, res, next) {
  console.log("🔍 Auth Middleware: Starting authentication");
  console.log("🔍 Request URL:", req.url);
  console.log("🔍 Request Method:", req.method);
  
  const authHeader = req.headers["authorization"] || req.cookies?.token;
  console.log("🔍 Auth header:", authHeader ? `${authHeader.substring(0, 30)}...` : "null");
  console.log("🔍 Cookies token:", req.cookies?.token ? `${req.cookies.token.substring(0, 30)}...` : "null");
  
  const token = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : authHeader;
    
  console.log("🔍 Extracted token:", token ? `${token.substring(0, 30)}...` : "null");
  console.log("🔍 Token length:", token ? token.length : 0);
  
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  // Check token structure
  const tokenParts = token.split('.');
  console.log("🔍 Token parts count:", tokenParts.length);
  
  if (tokenParts.length !== 3) {
    console.log("❌ Invalid JWT structure");
    return res.status(403).json({ message: "Invalid token - malformed JWT" });
  }

  // 🚨 CRITICAL: Check JWT secret
  const jwtSecret = process.env.JWT_SECRET || "dev-secret";
  console.log("🔍 JWT Secret in middleware:", jwtSecret);
  console.log("🔍 JWT Secret length in middleware:", jwtSecret.length);
  console.log("🔍 Environment variables:", {
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET_SET: !!process.env.JWT_SECRET
  });

  // Try to decode token payload first (without verification)
  try {
    const decodedPayload = jwt.decode(token);
    console.log("🔍 Token payload (unverified):", decodedPayload);
  } catch (decodeError) {
    console.log("❌ Cannot decode token payload:", decodeError.message);
  }

  // jwt.verify(token, jwtSecret, (err, user) => {
  //   if (err) {
  //     console.log("❌ JWT verification failed:", err.name, err.message);
  //     console.log("❌ Full error:", err);
      
  //     // Detailed error analysis
  //     if (err.name === 'TokenExpiredError') {
  //       console.log("❌ Token expired at:", err.expiredAt);
  //       console.log("❌ Current time:", new Date());
  //       return res.status(403).json({ 
  //         message: "Token expired", 
  //         expiredAt: err.expiredAt,
  //         currentTime: new Date()
  //       });
  //     } else if (err.name === 'JsonWebTokenError') {
  //       console.log("❌ JWT Error details:", err.message);
        
  //       // Try with different secret to test
  //       if (err.message.includes('invalid signature')) {
  //         console.log("❌ SIGNATURE MISMATCH - This means JWT_SECRET is different!");
  //         console.log("❌ Secret being used:", jwtSecret);
  //       }
        
  //       return res.status(403).json({ 
  //         message: "Invalid token", 
  //         error: err.message,
  //         secretUsed: jwtSecret
  //       });
  //     } else if (err.name === 'NotBeforeError') {
  //       console.log("❌ Token not active until:", err.date);
  //       return res.status(403).json({ 
  //         message: "Token not yet valid", 
  //         notBefore: err.date 
  //       });
  //     }
      
  //     return res.status(403).json({ 
  //       message: "Invalid token", 
  //       error: err.message,
  //       errorName: err.name
  //     });
  //   }
    
  //   console.log("✅ Token verified successfully!");
  //   console.log("✅ User ID:", user.id);
  //   console.log("✅ User email:", user.email);
  //   console.log("✅ User role:", user.role);
  //   console.log("✅ Token issued at:", new Date(user.iat * 1000));
  //   console.log("✅ Token expires at:", new Date(user.exp * 1000));


  //   if (user.isDisabled) {
  //     return res.status(403).json({
  //       message: "Your account has been disabled. Please contact support.",
  //     });
  //   }
    
  //   req.user = user;
  //   next();
  // });

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    console.log("🔍 Decoded token after verification attempt:", decoded) ;
  if (err) {
    console.log("❌ JWT verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  try {
    const dbUser = await User.findById(decoded.id || decoded._id);

    console.log("🔍 Fetched user from DB:", dbUser);

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (dbUser.disabled) {
      console.log(`🚫 User ${dbUser.email} is disabled`);
      return res.status(403).json({
        message: "Your account has been disabled. Please contact support.",
      });
    }

    req.user = dbUser; // pass full fresh user document
    next();
  } catch (dbErr) {
    console.error("❌ DB fetch error:", dbErr);
    return res.status(500).json({ message: "Internal server error" });
  }
});

}

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    console.log("🔍 Role Authorization: Starting role check");
    console.log("🔍 Request user:", req.user);
    
    const userRole = req.user?.role;
    console.log("🔍 User role:", userRole);
    console.log("🔍 Required roles:", allowedRoles);
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log("❌ Role authorization failed");
      console.log("❌ User has role:", userRole || "none");
      console.log("❌ Required one of:", allowedRoles);
      
      return res.status(403).json({
        message: "Forbidden - insufficient permissions",
        requiredRoles: allowedRoles,
        userRole: userRole || "user",
      });
    }
    
    console.log("✅ Role authorization successful");
    next();
  };
}