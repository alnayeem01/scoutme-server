"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const firebaseAdmin_1 = __importDefault(require("../utils/firebaseAdmin"));
const registerUser = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(403)
            .json({ error: "Unauthorised Access, Please try again" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = await firebaseAdmin_1.default
            .auth()
            .verifyIdToken(token);
        // Destructure all attributes
        const { uid, email, phone_number, picture, name } = decodedToken;
        return res.json({
            message: "Token verified successfully",
            user: { uid, email, name, picture, phone_number },
        });
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({
            error: "Invalid token",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
exports.registerUser = registerUser;
