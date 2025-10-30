import express from "express";
import cors from "cors";
import authRouter from "./routers/auth";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.get("/", (req, res) => res.json("Hello World"));

app.use("/auth", authRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
