import conf from "../config/config.js";
import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: No token provided",
        });
    }

    try {
        const decoded = jwt.verify(token, conf.ACCESS_TOKEN_SECRET);
        req.user = {
            id: decoded.id,
        };
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Unauthorized: Access Token expired",
            });
        }

        console.error(error);
        return res.status(401).json({
            message: "Unauthorized: Invalid token",
        });
    }
};

export default requireAuth;
