import express from "express";
import { createServer } from "http";
import { setupAuth } from "./auth";
import { setupRoutes } from "./routes";
import { db } from "@db";
import { testConnection } from "@db";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

// Setup authentication
setupAuth(app);

// Setup routes
setupRoutes(app);

// Serve static files from the dist/public directory
app.use(express.static(path.join(__dirname, "../dist/public")));

// Serve index.html for all other routes (client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

// Get port from environment variable or use fallback
const port = Number(process.env.PORT) || 5001;

// Function to start server
const startServer = async (retryPort = 0) => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    // Start server
    server.listen(port + retryPort, () => {
      console.log(`Server running on port ${port + retryPort}`);
    });
  } catch (error: any) {
    if (error?.code === 'EADDRINUSE') {
      console.log(`Port ${port + retryPort} is in use, trying ${port + retryPort + 1}...`);
      startServer(retryPort + 1);
    } else {
      console.error('Error starting server:', error);
      process.exit(1);
    }
  }
};

startServer();
