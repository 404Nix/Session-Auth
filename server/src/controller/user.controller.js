import userModel from "../models/user.model.js";
import { generateAccessToken } from "../utils/tokens.js";

const registerUser = async (req, res) => {
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

    const token = generateAccessToken(newUser._id);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            username: newUser.name,
            email: newUser.email,
        },
        token,
    });
};
const loginUser = async (req, res) => {
    res.json({ message: "Login route" });
};

const refreshToken = async (req, res) => {
    res.json({ message: "Refresh token route" });
};

const logoutUser = async (req, res) => {
    res.json({ message: "Logout route" });
};

export { registerUser, loginUser, refreshToken, logoutUser };
