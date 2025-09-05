import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./database/index.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management API",
    endpoints: {
      addSchool: "POST /api/addSchool",
      listSchools: "GET /api/listSchools?latitude=<lat>&longitude=<lng>",
      healthCheck: "GET /health",
    },
  });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints:`);
      console.log(`   - POST http://localhost:${PORT}/api/addSchool`);
      console.log(`   - GET  http://localhost:${PORT}/api/listSchools`);
      console.log(`   - GET  http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
