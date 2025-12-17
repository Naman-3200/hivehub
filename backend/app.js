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
import shopifyAuthRoutes from "./controller/shopifyAuth.controller.js";
import storeAnalyzerRoutes from "./routes/storeAnalyzer.routes.js";




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
app.use("/api", paymentRoutes); 
app.use("/api/store-users/manage", storeUsersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/web-products", webProductRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", settingsRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/auth/shopify", shopifyAuthRoutes);
app.use("/api/store-analyzer", storeAnalyzerRoutes);




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
