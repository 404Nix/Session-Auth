import "./config/env.js";
import conf from "./config/config.js";
import express from "express";
import app from "./app.js";
import connectDB from "./db/index.js";

// development only
import dns from "dns";
if (conf.NODE_ENV === "development") {
    dns.setServers(["8.8.8.8"]);
}

(async () => {
    try {
        await connectDB();
        app.listen(conf.PORT, () => {
            console.log(
                `Server running in ${conf.NODE_ENV} mode on port ${conf.PORT}`,
            );
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
})();
