const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const connectToMongo = require("./config/database");

// Create an express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectToMongo();

app.use("/api/books", bookRoutes);

// Root route
app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});

// API route
app.get("/api", (req, res) => {
  return res.status(200).send("API is running");
});

app.use((req, res) => {
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
