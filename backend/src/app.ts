import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import scheduleRoutes from "./routes/scheduleRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", scheduleRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Micro-ATS Backend is running!");
});

export default app;