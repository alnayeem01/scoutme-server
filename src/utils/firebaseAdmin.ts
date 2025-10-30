import admin, { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

function decodeMaybeBase64(value: string): string {
  try {
    const decoded = Buffer.from(value, "base64").toString("utf8");
    // Heuristic: base64 decode should produce JSON starting with '{'
    return decoded.trim().startsWith("{") ? decoded : value;
  } catch {
    return value;
  }
}

function loadServiceAccount(): ServiceAccount {
  // Option A: FIREBASE_SERVICE_ACCOUNT contains the entire JSON (raw or base64)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const raw = decodeMaybeBase64(process.env.FIREBASE_SERVICE_ACCOUNT);
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const privateKey = String(parsed["private_key"] || "").replace(/\\n/g, "\n");
      const clientEmail = String(parsed["client_email"] || "");
      const projectId = String(parsed["project_id"] || "");
      if (!privateKey || !clientEmail) {
        throw new Error("service account JSON missing private_key or client_email");
      }
      const mapped: ServiceAccount = {
        privateKey,
        clientEmail,
        projectId,
      } as unknown as ServiceAccount;
      return mapped;
    } catch (err) {
      throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT. Ensure it is valid JSON or base64 JSON.");
    }
  }

  // Option B: individual env vars
  const required = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ] as const;
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase env vars: ${missing.join(", ")}. ` +
        "Provide FIREBASE_SERVICE_ACCOUNT (JSON/base64) or individual vars."
    );
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  } as unknown as ServiceAccount;
}

const serviceAccount = loadServiceAccount();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully");
}

export default admin;
