import jwt from "jsonwebtoken";

const JWT_SECRET = "replace_this_secret";

export const requireAuth = (req, res, next) => {
  try {
    // Expect Authorization: Bearer <token>
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "No authorization header" });

    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res.status(401).json({ error: "Invalid authorization format" });

    const token = parts[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
