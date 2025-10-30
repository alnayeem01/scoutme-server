import { RequestHandler } from "express";
import admin from "../utils/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export const registerUser: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(403)
      .json({ error: "Unauthorised Access, Please try again" });
  const token = authHeader.split(" ")[1];

  try {
  } catch (e) {
    // verify fireabse token
    const deocodedToken: DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);

    //destructure all attributes
    const { uid, email, phone_number, picture } = deocodedToken;
    return res.json({
      message: "Token verified successfully",
      user: { uid, email, name, picture },
    });
  }
};
