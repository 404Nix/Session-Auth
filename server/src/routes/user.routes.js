import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import { loginUser, logoutUser, refreshToken, registerUser } from "../controller/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", requireAuth, logoutUser);
router.get("/refresh", requireAuth, refreshToken);

export default router;
