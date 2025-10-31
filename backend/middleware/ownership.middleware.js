// middleware/ownership.middleware.js
import Store from "../model/store.model.js";

export const requireStoreOwner = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.query.storeId || req.body.storeId;
    if (!storeId) return res.status(400).json({ message: "storeId required" });

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // superadmin always allowed
    if (req.user.role === "superadmin") return next();

    if (String(store.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your store" });
    }
    next();
  } catch (e) {
    next(e);
  }
};
