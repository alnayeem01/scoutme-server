import { RequestHandler } from "express";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export const registerUser: RequestHandler = async (req, res) => {
  
  try {
    const { name, email, phone, photoUrl, firebaseUid } = req.body;
    if (!firebaseUid || !email || !name) {
      return res
        .status(400)
        .json({ error: "firebaseUid, name and email are required" });
    }
    // create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        firebaseUid,
        name,
        phone,
        avatar: photoUrl,
      },
    });

    return res.status(200).json({
      message: "User registered sucessfully",
      user: { newUser },
    });
  } catch (e) {
    console.error("Register error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
