import express from "express";
import { registerStoreUser, loginStoreUser } from "../controller/storeauth.controller.js";

const router = express.Router();

router.post("/register", registerStoreUser);
router.post("/login", loginStoreUser);

export default router;
