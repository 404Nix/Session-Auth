import jwt from "jsonwebtoken";
import conf from "../config/config.js";

export const generateAccessToken = (userId, sessionId='12345') => {
    const payload = {
        id: userId,
        session: sessionId,
    };
    return jwt.sign(payload, conf.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId) => {
    const payload = {
        id: userId,
    };
    return jwt.sign(payload, conf.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
