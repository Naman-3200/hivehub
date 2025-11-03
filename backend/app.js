// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import passport from "./config/passport.js";

// // Routes
// import userRoutes from "./routes/user.route.js";
// import productRoutes from "./routes/productRoutes.js";
// import authRoutes from "./routes/auth.route.js";
// import storeRoutes from "./routes/store.route.js";
// import genProductRoutes from "./routes/genproduct.route.js";
// import path from "path";
// import Store from "./model/store.model.js";

// const app = express();

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "32KB" }));
// app.use(express.static("public"));
// app.use(cookieParser());

// // if session is used (can be removes if only depend on jwt token)
// // app.use(
// //   session({
// //     secret: "your-secret-key",
// //     resave: false,
// //     saveUninitialized: true,
// //     cookie: {
// //       secure: false,
// //       maxAge: 24 * 60 * 60 * 1000,
// //     },
// //   })
// // );

// app.use(passport.initialize());
// // app.use(passport.session());

// app.use("/api", apiRouter);


// // Handle custom domain routing
// app.use(async (req, res, next) => {
//   const host = req.headers.host; // e.g. `mycoolshop.com`
//   // Request is likely HTTP(s) host header without port
//   const store = await Store.findOne({ customDomain: host, domainVerified: true });
//   if (store) {
//     // Serve the frontend index (React build)
//     return res.sendFile(path.resolve("./client/build/index.html"));
//   }
//   next();
// });

// // Static serve and fallback
// app.use(express.static("./client/build"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve("./client/build/index.html"));
// });

// // const requestLogger = (req, res, next) => {
// //   console.log(`🌐 REQUEST: ${req.method} ${req.url}`);
// //   console.log(`🌐 Headers:`, req.headers);
// //   console.log(`🌐 Body:`, req.body);
// //   console.log(`🌐 Query:`, req.query);
// //   console.log(`🌐 Cookies:`, req.cookies);
// //   console.log('🌐 =====================================');
// //   next();
// // };

// // // Add this BEFORE your route definitions in app.js
// // app.use(requestLogger);




// app.use("/user", userRoutes);
// app.use("/api", productRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/stores", storeRoutes);
// app.use("/api", genProductRoutes)


// export default app;







import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";
import path from "path";
import Store from "./model/store.model.js";

// Routes
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/auth.route.js";
import storeRoutes from "./routes/store.route.js";
import genProductRoutes from "./routes/genproduct.route.js";
import storeAuthRoutes from "./routes/storeauth.routes.js";
import communityRoutes from "./routes/community.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.route.js";
import storeUsersRoutes from "./routes/storeusers.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import webProductRoutes from "./routes/webProduct.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";








const app = express();

// ---------- Middleware setup ----------
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Allow large payloads (up to 50 MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

// ---------- API ROUTES ----------
app.use("/user", userRoutes);
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api", genProductRoutes);
app.use("/api/store-users", storeAuthRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", paymentRoutes); // Payment related routes
app.use("/api/store-users/manage", storeUsersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/web-products", webProductRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", settingsRoutes);
app.use("/api/subscription", subscriptionRoutes);











// ---------- Handle Custom Domain ----------
app.use(async (req, res, next) => {
  try {
    const host = req.headers.host; // e.g. "naman.com"
    const store = await Store.findOne({ customDomain: host, domainVerified: true });

    if (store) {
      // ✅ Serve your React frontend (client build)
      return res.sendFile(path.resolve("./client/build/index.html"));
    }
    next();
  } catch (err) {
    console.error("Custom domain check failed:", err);
    next();
  }
});

// Serve published store HTML dynamically
app.get("/:domain", async (req, res) => {
  const { domain } = req.params;
  const store = await Store.findOne({ domain });

  if (!store || !store.websiteHtml) {
    return res.send("<h1>Store not found or not published yet.</h1>");
  }

  res.send(store.websiteHtml);
});

// ---------- Serve React build ----------
app.use(express.static("./client/build"));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve("./client/build/index.html"));
});


export default app;
