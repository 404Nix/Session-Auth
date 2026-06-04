import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;