import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import serviceRoutes from "./routes/serviceRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDatabase();

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Backend API is running with TypeScript!",
    version: "1.0.0",
    architecture: "Repository/Controller/Model/Service",
    database: "MongoDB",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    database: "MongoDB",
  });
});

// Routes API
app.use("/api", serviceRoutes);

// Middleware de gestion d'erreur 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Middleware de gestion d'erreur globale
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erreur globale:", err);
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: MongoDB`);
  console.log(`🏗️  Architecture: Repository/Controller/Model/Service`);
});
