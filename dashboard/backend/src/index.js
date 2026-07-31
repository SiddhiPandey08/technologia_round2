import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import missionRoutes from "./routes/mission.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://technologia-round2-qqjf.vercel.app",
  "http://localhost:5173",
].filter(Boolean); // Filter out undefined values if CLIENT_ORIGIN isn't set

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like curl, Postman, or mobile apps)
      if (!origin) return callback(null, true);

      // Check if origin is explicitly listed OR matches any Vercel preview URL for this project
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/technologia-round2.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy blocked access from origin: ${origin}`),
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/missions", missionRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`recruit-os backend listening on :${PORT}`),
    );
  })
  .catch((err) => {
    console.error("failed to connect to mongodb", err);
    process.exit(1);
  });
