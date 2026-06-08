import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import {
    loginUser,
    logoutUser,
    refreshToken,
    registerUser,
    getUser
} from "../controller/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken);

router.post("/logout", requireAuth, logoutUser);
router.get("/get-user", requireAuth, getUser);

export default router;
