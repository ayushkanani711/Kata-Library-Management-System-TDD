const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Create an express app
const app = express();

// Root route
app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});

// API route
app.get("/api", (req, res) => {
  return res.status(200).send("API is running");
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\nServer is running on port : ${PORT}`);
});

module.exports = app;
