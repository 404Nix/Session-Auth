import userModel from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";
import conf from "../config/config.js";
import sessionModel from "../models/session.model.js";
import hashFunction from "../utils/hash.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await userModel.create({
            name: username,
            email,
            password,
        });

        const refreshToken = generateRefreshToken(newUser._id);

        const hashRefreshToken = hashFunction(refreshToken);

        const session = await sessionModel.create({
            user: newUser._id,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
            refreshToken: hashRefreshToken,
        });

        const accessToken = generateAccessToken(newUser._id, session._id);

        res.cookie("refreshToken", refreshToken, cookieOptions);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                username: newUser.name,
                email: newUser.email,
                updatedAt: newUser.updatedAt,
            },
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        const refreshToken = generateRefreshToken(user._id);

        const hashRefreshToken = hashFunction(refreshToken);

        const session = await sessionModel.create({
            user: user._id,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
            refreshToken: hashRefreshToken,
        });

        res.cookie("refreshToken", refreshToken, cookieOptions);

        const accessToken = generateAccessToken(user._id, session._id);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                username: user.name,
                email: user.email,
                updatedAt: user.updatedAt,
            },
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res
                .status(401)
                .json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(token, conf.REFRESH_TOKEN_SECRET);

        const hashRefreshToken = hashFunction(token);
        const session = await sessionModel.findOne({
            refreshToken: hashRefreshToken,
            revoked: false,
        });

        if (!session) {
            res.status(401).json({
                message: "Session Invalid Or Unauthorized User Token",
            });
        }

        const newRefreshToken = generateRefreshToken(decoded._id);
        const hashNewRefreshToken = hashFunction(newRefreshToken);
        session.refreshToken = hashNewRefreshToken;
        await session.save();
        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        const newAccessToken = generateAccessToken(decoded._id);
        res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const hashRefreshToken = hashFunction(refreshToken);

        const decoded = jwt.verify(refreshToken, conf.REFRESH_TOKEN_SECRET);
        const session = await sessionModel.findOne({
            refreshToken: hashRefreshToken,
            revoked: false,
        });

        if (!session) {
            res.status(401).json({
                message: "Session invalid or expired",
            });
        }

        session.revoked = true;
        await session.save();

        res.clearCookie("refreshToken", cookieOptions);

        res.status(200).json({
            message: "Logged Out successfully!",
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

const logoutAll = async (req, res) => {
    try {
        const { id: userId } = req.user;

        await sessionModel.updateMany(
            {
                user: userId,
                revoked: false,
            },
            {
                revoked: true,
            },
        );

        res.clearCookie("refreshToken", cookieOptions);

        res.status(200).json({
            message: "Logged Out from All Devices Successfully!",
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

const getUser = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const user = await userModel
            .findById(userId)
            .select("name email updatedAt");
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        res.status(200).json({
            message: "User data fetched!",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    getUser,
    logoutAll,
};
