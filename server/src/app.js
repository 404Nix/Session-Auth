import express from "express";
import conf from "./config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";

const app = express();

if (conf.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

const clientURL =
    conf.NODE_ENV === "production" ? conf.CLIENT_URL : conf.DEV_CLIENT_URL;

app.use(
    cors({
        origin: clientURL,
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", userRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
})

export default app;
