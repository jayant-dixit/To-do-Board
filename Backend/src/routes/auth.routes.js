import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.Controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;