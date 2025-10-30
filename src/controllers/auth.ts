import { RequestHandler } from "express";
import admin from "../utils/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";

export const registerUser: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Unauthorized: missing Authorization header" });
  }

  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : authHeader;

  try {
    const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture, phone_number } = decodedToken as unknown as {
      uid: string;
      email?: string;
      name?: string;
      picture?: string;
      phone_number?: string;
    };

    return res.json({
      message: "Token verified successfully",
      user: { uid, email: email ?? null, name: name ?? null, picture: picture ?? null, phoneNumber: phone_number ?? null },
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
