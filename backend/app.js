import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
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

// Routes
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/productRoutes.js";


app.use("/user", userRoutes);
app.use("/api", productRoutes);


export default app;
