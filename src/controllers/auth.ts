import { RequestHandler } from "express";
import admin from "../utils/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export const registerUser: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(403)
      .json({ error: "Unauthorised Access, Please try again" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken: DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);

    // Destructure all attributes
    const { uid, email, phone_number, picture, name } = decodedToken;
    
    return res.json({
      message: "Token verified successfully",
      user: { uid, email, name, picture, phone_number },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ 
      error: "Invalid token", 
      details: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};