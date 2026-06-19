import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    logoutAll,
    refreshToken,
    getUser,
} from "../controller/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken);

router.post("/logout", requireAuth, logoutUser);
router.post("/logout-all", requireAuth, logoutAll);
router.get("/getme", requireAuth, getUser);

export default router;
