import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";

// Routes
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/auth.route.js";
import storeRoutes from "./routes/store.route.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "32KB" }));
app.use(express.static("public"));
app.use(cookieParser());

// if session is used (can be removes if only depend on jwt token)
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

app.use(passport.initialize());
// app.use(passport.session());

const requestLogger = (req, res, next) => {
  console.log(`🌐 REQUEST: ${req.method} ${req.url}`);
  console.log(`🌐 Headers:`, req.headers);
  console.log(`🌐 Body:`, req.body);
  console.log(`🌐 Query:`, req.query);
  console.log(`🌐 Cookies:`, req.cookies);
  console.log('🌐 =====================================');
  next();
};

// Add this BEFORE your route definitions in app.js
app.use(requestLogger);


app.use("/user", userRoutes);
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);


export default app;
