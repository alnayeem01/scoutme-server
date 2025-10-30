import express from "express";
import cors from "cors";
import authRouter from "./routers/auth";

const app = express();

app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    return callback(null, true); // allow all origins dynamically
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.get("/", (req, res) => res.json("Hello World"));

app.use("/auth", authRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
