const express = require("express");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");

// Create an express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/books", bookRoutes);

// Root route
app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});

// API route
app.get("/api", (req, res) => {
  return res.status(200).send("API is running");
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
