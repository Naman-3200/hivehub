import Store from "../model/store.model.js";

// Create store
export const createStore = async (req, res) => {
  try {
      console.log("Create store request body:", req.body);
    const { name, url } = req.body;
    const domain = url
    const ownerId = req.user.id; // comes from auth middleware
    console.log("Owner ID from token:", ownerId);

    const newStore = new Store({ name, domain, ownerId });
    await newStore.save();

    res.status(201).json({ success: true, store: newStore });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ success: false, message: "Failed to create store" });
  }
};

export const getStores = async (req, res) => {
  try {
    console.log("Fetching stores for user ID:", req.user.id);
    const stores = await Store.find({ ownerId: req.user.id });
    res.json({ success: true, stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stores" });
  }
};