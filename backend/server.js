const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const envPath = fs.existsSync(path.join(__dirname, ".env"))
  ? path.join(__dirname, ".env")
  : path.join(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });

const connectDB = require("./config/db");
const apiRoutes = require("./routes/apiRoutes");
const aiRoutes = require("./routes/aiRoutes");
const officerRoutes = require("./routes/officerRoutes");
const tigerRoutes = require("./routes/tigerRoutes");
const cameraTrapRoutes = require("./routes/cameraTrapRoutes");

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Connect to Database
connectDB();

const frontendPath = path.join(__dirname, "..", "frontend");
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use("/api", apiRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", officerRoutes);
app.use("/api", tigerRoutes);
app.use("/api", cameraTrapRoutes);

// Uploaded files
app.use("/uploads", express.static(uploadsPath));

// Frontend
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 404 JSON for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log("🌿 VYAGHRAVANA • TIGER INTELLIGENCE");
  console.log("======================================");
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Open in browser:   http://localhost:${PORT}`);
  console.log("======================================");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n⚠️  Port ${PORT} is already in use by a running Node process.`);
    console.error(`👉 Run this PowerShell command to stop it:`);
    console.error(`   Stop-Process -Name node -Force\n`);
  } else {
    console.error("Server error:", err);
  }
});